import React from 'react';
import styles from './ProductDetails.module.scss';

const ProductDetails = ({ model, productType = 'smartboards' }) => {
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
    size,
    resolution,
    os,
    touchTechnology,
    features,
    warranty,
    image,
    brightness,
    contrastRatio,
    viewingAngle,
    responseTime,
    panelLife,
    audioOutput,
    powerConsumption
  } = model;

  return (
    <div className={styles.productDetails}>
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <a href="/products">Products</a> &gt;
          <a href={`/products/${productType}/`}>{productType === 'smartboards' ? 'Smart Boards' : 'Lecterns'}</a> &gt;
          <a href={`/products/${productType}/${brand.toLowerCase().replace(/\s+/g, '-')}`}>
            {brand}
          </a>{' '}
          &gt;
          <span>{modelName}</span>
        </div>
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
            <button className={styles.primaryButton}>Request Quote</button>
            <button className={styles.secondaryButton}>Book a Demo</button>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.specTable}>
            <h2>Specifications</h2>
            <table>
              <tbody>
                <tr>
                  <th>Screen Size</th>
                  <td>{size}"</td>
                </tr>
                <tr>
                  <th>Resolution</th>
                  <td>{resolution}</td>
                </tr>
                <tr>
                  <th>Operating System</th>
                  <td>{os}</td>
                </tr>
                <tr>
                  <th>Touch Technology</th>
                  <td>{touchTechnology}</td>
                </tr>
                <tr>
                  <th>Brightness</th>
                  <td>{brightness}</td>
                </tr>
                <tr>
                  <th>Contrast Ratio</th>
                  <td>{contrastRatio}</td>
                </tr>
                <tr>
                  <th>Viewing Angle</th>
                  <td>{viewingAngle}</td>
                </tr>
                <tr>
                  <th>Response Time</th>
                  <td>{responseTime}</td>
                </tr>
                <tr>
                  <th>Panel Life</th>
                  <td>{panelLife}</td>
                </tr>
                <tr>
                  <th>Audio Output</th>
                  <td>{audioOutput}</td>
                </tr>
                <tr>
                  <th>Power Consumption</th>
                  <td>{powerConsumption}</td>
                </tr>
                <tr>
                  <th>Warranty</th>
                  <td>{warranty}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.features}>
            <h2>Key Features</h2>
            <ul className={styles.featureList}>
              {features.map((feature, index) => (
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
