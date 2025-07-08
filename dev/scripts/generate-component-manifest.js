import { Project, SyntaxKind, ts } from 'ts-morph';
import { promises as fs } from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'src', 'components');
const manifestPath = path.join(process.cwd(), 'component-manifest.json');

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
});

// Removed: project.addSourceFilesFromTsConfig();

async function getComponentFiles(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const res = path.resolve(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await getComponentFiles(res));
    } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.astro'))) {
      files.push(res);
    }
  }
  return files;
}

function extractTsxComponentInfo(filePath) {
  const sourceFile = project.getSourceFile(filePath) || project.addSourceFileAtPath(filePath);
  const componentName = path.basename(filePath, '.tsx');
  const relativePath = path.relative(process.cwd(), filePath);

  let props = [];
  let description = '';

  // Find React component exports
  sourceFile.forEachDescendant((node) => {
    // Look for function declarations and variable declarations that could be components
    if (node.isKind(SyntaxKind.FunctionDeclaration) || node.isKind(SyntaxKind.VariableDeclaration)) {
      const declaration = node.asKind(SyntaxKind.FunctionDeclaration) || node.asKind(SyntaxKind.VariableDeclaration);
      if (!declaration) return;

      const declarationName = declaration.getSymbol()?.getName();
      if (declarationName === componentName || (declaration.isKind(SyntaxKind.FunctionDeclaration) && declaration.getName() === componentName)) {
        
        // Extract JSDoc description from the declaration node directly
        try {
          const jsDocs = declaration.getJsDocs();
          if (jsDocs && jsDocs.length > 0) {
            description = jsDocs[0].getDescription();
          }
        } catch (error) {
          // Fallback: try to extract from leading comments
          const leadingComments = declaration.getLeadingCommentRanges();
          if (leadingComments && leadingComments.length > 0) {
            const comment = leadingComments[leadingComments.length - 1];
            const text = comment.getText();
            if (text.startsWith('/**')) {
              description = text.replace(/\/\*\*|\*\/|\*/g, '').trim();
            }
          }
        }

        // Extract props from function parameters
        if (declaration.isKind(SyntaxKind.FunctionDeclaration)) {
          const parameters = declaration.getParameters();
          if (parameters.length > 0) {
            const propsParam = parameters[0];
            const propsType = propsParam.getType();
            
            extractPropsFromType(propsType, sourceFile, props);
          }
        } else if (declaration.isKind(SyntaxKind.VariableDeclaration)) {
          // Handle arrow functions assigned to variables
          const initializer = declaration.getInitializer();
          if (initializer && initializer.isKind(SyntaxKind.ArrowFunction)) {
            const parameters = initializer.getParameters();
            if (parameters.length > 0) {
              const propsParam = parameters[0];
              const propsType = propsParam.getType();
              
              extractPropsFromType(propsType, sourceFile, props);
            }
          }
        }
      }
    }
  });

  return {
    name: componentName,
    path: relativePath,
    type: 'React',
    props: props,
    description: description,
  };
}

function extractPropsFromType(propsType, sourceFile, props) {
  try {
    const propsSymbol = propsType.getSymbol();
    if (propsSymbol) {
      const propsDeclaration = propsSymbol.getValueDeclaration();
      if (propsDeclaration && propsDeclaration.isKind(SyntaxKind.TypeLiteral)) {
        // Handle inline type literals
        propsDeclaration.getProperties().forEach(prop => {
          const propName = prop.getName();
          const propType = prop.getType().getText(sourceFile);
          const isOptional = prop.hasQuestionToken();
          
          // Extract JSDoc from property
          let propDescription = '';
          try {
            const jsDocs = prop.getJsDocs();
            propDescription = jsDocs && jsDocs.length > 0 ? jsDocs[0].getDescription() : '';
          } catch (error) {
            // Fallback: try to extract from leading comments
            try {
              const leadingComments = prop.getLeadingCommentRanges();
              if (leadingComments && leadingComments.length > 0) {
                const comment = leadingComments[leadingComments.length - 1];
                const text = comment.getText();
                if (text.startsWith('/**')) {
                  propDescription = text.replace(/\/\*\*|\*\/|\*/g, '').trim();
                }
              }
            } catch (fallbackError) {
              // Silent fallback
            }
          }

          props.push({
            name: propName,
            type: propType,
            required: !isOptional,
            description: propDescription,
          });
        });
      } else {
        // Handle interface references
        propsType.getProperties().forEach(propSymbol => {
          const propName = propSymbol.getName();
          const propTypeText = propSymbol.getTypeAtLocation(sourceFile).getText(sourceFile);
          const isOptional = propSymbol.isOptional();
          
          // Try to get JSDoc from value declaration
          let propDescription = '';
          const valueDeclaration = propSymbol.getValueDeclaration();
          if (valueDeclaration) {
            try {
              const jsDocs = valueDeclaration.getJsDocs();
              propDescription = jsDocs && jsDocs.length > 0 ? jsDocs[0].getDescription() : '';
            } catch (error) {
              // Silent fallback to empty description
            }
          }

          props.push({
            name: propName,
            type: propTypeText,
            required: !isOptional,
            description: propDescription,
          });
        });
      }
    }
  } catch (error) {
    console.warn(`Could not extract props from type: ${error.message}`);
  }
}

async function extractAstroComponentInfo(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const componentName = path.basename(filePath, '.astro');
  const relativePath = path.relative(process.cwd(), filePath);

  let props = [];
  let description = '';

  // Extract description from top-level JSDoc comment
  const topCommentMatch = content.match(/^\/\*\*\s*\n([\s\S]*?)\*\//);
  if (topCommentMatch) {
    description = topCommentMatch[1].replace(/\*\s*/g, '').trim();
  }

  // Extract props from frontmatter script block
  const scriptMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (scriptMatch && scriptMatch[1]) {
    const scriptContent = scriptMatch[1];

    try {
      const tempFilePath = filePath + '.ts';
      await fs.writeFile(tempFilePath, scriptContent);
      const sourceFile = project.addSourceFileAtPath(tempFilePath);

      sourceFile.forEachDescendant((node) => {
        // Look for Astro.props destructuring
        if (node.isKind(SyntaxKind.VariableDeclaration)) {
          const initializer = node.getInitializer();
          if (initializer && initializer.getText().includes('Astro.props')) {
            const nameNode = node.getNameNode();
            if (nameNode && nameNode.isKind(SyntaxKind.ObjectBindingPattern)) {
              nameNode.getElements().forEach(element => {
                const propName = element.getNameNode().getText();
                const propType = element.getType().getText(sourceFile);
                const isOptional = !!element.getInitializer();

                props.push({
                  name: propName,
                  type: propType,
                  required: !isOptional,
                  description: '',
                });
              });
            }
          }
        }
        
        // Look for interface/type declarations for props
        if (node.isKind(SyntaxKind.InterfaceDeclaration) || node.isKind(SyntaxKind.TypeAliasDeclaration)) {
          const declarationName = node.getName();
          if (declarationName && declarationName.toLowerCase().includes('props')) {
            if (node.isKind(SyntaxKind.InterfaceDeclaration)) {
              node.getProperties().forEach(prop => {
                if (prop.isKind(SyntaxKind.PropertySignature)) {
                  const propName = prop.getName();
                  const propType = prop.getType().getText(sourceFile);
                  const isOptional = prop.hasQuestionToken();
                  
                  // Extract JSDoc from property
                  let propDescription = '';
                  try {
                    const jsDocs = prop.getJsDocs();
                    propDescription = jsDocs && jsDocs.length > 0 ? jsDocs[0].getDescription() : '';
                  } catch (error) {
                    // Silent fallback to empty description
                  }

                  props.push({
                    name: propName,
                    type: propType,
                    required: !isOptional,
                    description: propDescription,
                  });
                }
              });
            } else if (node.isKind(SyntaxKind.TypeAliasDeclaration)) {
              const typeNode = node.getTypeNode();
              if (typeNode && typeNode.isKind(SyntaxKind.TypeLiteral)) {
                typeNode.getProperties().forEach(prop => {
                  if (prop.isKind(SyntaxKind.PropertySignature)) {
                    const propName = prop.getName();
                    const propType = prop.getType().getText(sourceFile);
                    const isOptional = prop.hasQuestionToken();
                    
                    // Extract JSDoc from property
                    let propDescription = '';
                    try {
                      const jsDocs = prop.getJsDocs();
                      propDescription = jsDocs && jsDocs.length > 0 ? jsDocs[0].getDescription() : '';
                    } catch (error) {
                      // Silent fallback to empty description
                    }

                    props.push({
                      name: propName,
                      type: propType,
                      required: !isOptional,
                      description: propDescription,
                    });
                  }
                });
              }
            }
          }
        }
      });
      
      project.removeSourceFile(sourceFile);
      await fs.unlink(tempFilePath);

    } catch (e) {
      console.warn(`Could not parse Astro script block for ${filePath}:`, e.message);
    }
  }

  return {
    name: componentName,
    path: relativePath,
    type: 'Astro',
    props: props,
    description: description,
  };
}

async function generateComponentManifest() {
  console.log('🔍 Scanning for component files...');
  const componentFiles = await getComponentFiles(componentsDir);
  console.log(`Found ${componentFiles.length} component files`);
  
  const manifest = [];
  const errors = [];

  // Add TypeScript files to the project first for better type resolution
  const tsxFiles = componentFiles.filter(f => f.endsWith('.tsx'));
  for (const filePath of tsxFiles) {
    try {
      project.addSourceFileAtPath(filePath);
    } catch (error) {
      console.warn(`Could not add TypeScript file to project: ${filePath}`);
    }
  }

  console.log('🔧 Processing component files...');
  
  for (const filePath of componentFiles) {
    const fileName = path.basename(filePath);
    
    try {
      let info;
      if (filePath.endsWith('.tsx')) {
        info = extractTsxComponentInfo(filePath);
      } else if (filePath.endsWith('.astro')) {
        info = await extractAstroComponentInfo(filePath);
      }
      
      if (info) {
        // Validate the component info
        if (!info.name || !info.path || !info.type) {
          errors.push({
            file: filePath,
            error: 'Missing required component information',
          });
          continue;
        }
        
        // Ensure props is always an array
        if (!Array.isArray(info.props)) {
          info.props = [];
        }
        
        // Validate prop structure
        info.props = info.props.filter(prop => {
          if (!prop.name || typeof prop.required !== 'boolean') {
            console.warn(`Invalid prop structure in ${fileName}:`, prop);
            return false;
          }
          return true;
        });
        
        manifest.push(info);
        console.log(`✅ ${fileName} - ${info.props.length} props`);
      }
    } catch (error) {
      console.error(`❌ Error processing file ${fileName}:`, error.message);
      errors.push({
        file: filePath,
        error: error.message,
      });
    }
  }

  // Write the manifest
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  
  // Summary
  console.log('\n📊 Component Manifest Generation Summary:');
  console.log(`✅ Successfully processed: ${manifest.length} components`);
  console.log(`❌ Errors encountered: ${errors.length} files`);
  
  if (errors.length > 0) {
    console.log('\n🔧 Files with errors:');
    errors.forEach(({ file, error }) => {
      console.log(`   - ${path.basename(file)}: ${error}`);
    });
  }
  
  console.log(`\n📄 Generated component manifest at ${manifestPath}`);
}

generateComponentManifest();
