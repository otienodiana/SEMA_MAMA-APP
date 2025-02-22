import React from 'react';

// Sample data (could be fetched from an API or a static file)
const content = {
  "blocks": [
    {
      "@type": "@builder.io/sdk:Element",
      "id": "builder-d3d044b8d2b54308aabdfbc6cd471c59",
      "responsiveStyles": {
        "large": {
          "display": "flex",
          "minHeight": "0px",
          "maxWidth": "0px"
        },
        "medium": {}
      },
      "meta": {
        "fromFigma": true,
        "vcpImportId": "vcp-a9247f89cd43427bb3fd2bb923cdbf57",
        "vcpFigmaSelectionUUID": "ec7f8687-1e77-426f-b22f-b224e58692cb"
      }
    }
  ],
  "vcpImportId": "vcp-a9247f89cd43427bb3fd2bb923cdbf57"
};

const EducationalContentPage = () => {
  return (
    <div>
      <h1>Educational Content</h1>
      {content.blocks.map(block => (
        <div 
          key={block.id} 
          style={{
            display: block.responsiveStyles.large?.display || 'block', 
            minHeight: block.responsiveStyles.large?.minHeight || 'auto',
            maxWidth: block.responsiveStyles.large?.maxWidth || 'none'
          }}
        >
          {/* You can add more dynamic content here */}
          {block.meta.fromFigma ? <p>Imported from Figma</p> : null}
        </div>
      ))}
    </div>
  );
};

export default EducationalContentPage;
