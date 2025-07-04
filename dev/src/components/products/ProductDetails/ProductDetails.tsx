import React from 'react';
import styles from './ProductDetails.module.scss';
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs';
import type { ProductDetailsProps, ProductModel } from '../../../types/product';
import { generateProductSpecifications, type ProductCategory } from '../../../utils/product-specs';
import { generateProductBreadcrumbs } from '../../../utils/breadcrumb-generator';
import { getProductActions } from '../../../utils/product-actions';

const ProductDetails: React.FC<ProductDetailsProps> = ({ model, productType = 'smartboards' }) => {
  if (!model) {
    return (
      <div className={styles.notFound}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for could not be found.</p>
      </div>
    );
  }

  const {
    brand,
    model: modelName,
    features,
    image
  }: ProductModel = model;

  const specifications = generateProductSpecifications(model, productType as ProductCategory);
  const breadcrumbItems = generateProductBreadcrumbs(model, productType as ProductCategory);
  const actions = getProductActions(productType as ProductCategory);

  return (
    <div className={styles.productDetails}>
      <div className={styles.header}>
        <Breadcrumbs 
          items={breadcrumbItems}
          className={styles.breadcrumbs}
        />
        <h1 className={styles.title}>
          {brand} {modelName}
        </h1>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img
              src={image || '/assets/iboard-placeholder.jpeg'}
              alt={modelName}
            />
          </div>

          <div className={styles.actions}>
            {actions.map((action, index) => (
              <button
                key={index}
                className={action.primary ? styles.primaryButton : styles.secondaryButton}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.specTable}>
            <h2>Specifications</h2>
            <table>
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index}>
                    <th>{spec.label}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.features}>
            <h2>Key Features</h2>
            <ul className={styles.featureList}>
              {features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.relatedProducts}>
        <h2>Related Products</h2>
        <p>Coming soon...</p>
      </div>
    </div>
  );
};

export default ProductDetails;