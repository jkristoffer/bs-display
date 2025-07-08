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

  sourceFile.forEachDescendant((node) => {
    if (node.isKind(SyntaxKind.VariableDeclaration) || node.isKind(SyntaxKind.FunctionDeclaration)) {
      const declaration = node.asKind(SyntaxKind.VariableDeclaration) || node.asKind(SyntaxKind.FunctionDeclaration);
      if (!declaration) return;

      const declarationName = declaration.getSymbol()?.getName();
      if (declarationName === componentName) {
        const symbol = declaration.getSymbol();
        if (symbol) {
          const jsDocs = symbol.getJsDocs();
          if (jsDocs.length > 0) {
            description = jsDocs[0].getDescription();
          }
        }

        const type = declaration.getType();
        const callSignatures = type.getCallSignatures();

        for (const signature of callSignatures) {
          const parameters = signature.getParameters();
          if (parameters.length > 0) {
            const propsParam = parameters[0];
            const propsType = propsParam.getType();

            propsType.getProperties().forEach(propSymbol => {
              const propName = propSymbol.getName();
              const propTypeNode = propSymbol.getValueDeclaration()?.getTypeNode();
              const propTypeText = propTypeNode ? propTypeNode.getText(sourceFile) : propSymbol.getTypeAtLocation(sourceFile).getText(sourceFile);
              const isOptional = propSymbol.isOptional();
              const jsDocs = propSymbol.getJsDocs();
              const propDescription = jsDocs.length > 0 ? jsDocs[0].getDescription() : '';

              props.push({
                name: propName,
                type: propTypeText,
                required: !isOptional,
                description: propDescription,
              });
            });
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

async function extractAstroComponentInfo(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const componentName = path.basename(filePath, '.astro');
  const relativePath = path.relative(process.cwd(), filePath);

  let props = [];
  let description = '';

  const scriptMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (scriptMatch && scriptMatch[1]) {
    const scriptContent = scriptMatch[1];

    try {
      const tempFilePath = filePath + '.ts';
      await fs.writeFile(tempFilePath, scriptContent);
      const sourceFile = project.addSourceFileAtPath(tempFilePath);

      sourceFile.forEachDescendant((node) => {
        if (node.isKind(SyntaxKind.VariableDeclaration) && node.getInitializer()?.getText().includes('Astro.props')) {
          const objectBindingPattern = node.getNameNode();
          if (objectBindingPattern.isKind(SyntaxKind.ObjectBindingPattern)) {
            objectBindingPattern.getElements().forEach(element => {
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
        } else if (node.isKind(SyntaxKind.InterfaceDeclaration) || node.isKind(SyntaxKind.TypeAliasDeclaration)) {
          const declarationName = node.getName();
          if (declarationName.toLowerCase().includes('props')) {
            node.getProperties().forEach(prop => {
              const propName = prop.getName();
              const propType = prop.getType().getText(sourceFile);
              const isOptional = prop.hasQuestionToken();
              const jsDocs = prop.getJsDocs();
              const propDescription = jsDocs.length > 0 ? jsDocs[0].getDescription() : '';

              props.push({
                name: propName,
                type: propType,
                required: !isOptional,
                description: propDescription,
              });
            });
          }
        }
      });
      project.removeSourceFile(sourceFile);
      await fs.unlink(tempFilePath);

    } catch (e) {
      console.warn(`Could not parse Astro script block for ${filePath}:`, e.message);
    }
  }

  const topCommentMatch = content.match(/^\/\*\*\s*\n([\s\S]*?)\*\//);
  if (topCommentMatch) {
    description = topCommentMatch[1].replace(/\*\s*\*\//g, '').trim();
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
  const componentFiles = await getComponentFiles(componentsDir);
  const manifest = [];

  // Add all component files to the project before processing
  for (const filePath of componentFiles) {
    project.addSourceFileAtPath(filePath);
  }

  for (const filePath of componentFiles) {
    try {
      let info;
      if (filePath.endsWith('.tsx')) {
        info = extractTsxComponentInfo(filePath);
      } else if (filePath.endsWith('.astro')) {
        info = await extractAstroComponentInfo(filePath);
      }
      if (info) {
        manifest.push(info);
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Generated component manifest at ${manifestPath}`);
}

generateComponentManifest();
