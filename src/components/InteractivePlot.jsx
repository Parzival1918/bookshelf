import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export function InteractivePlot({ books, onBookSelect }) {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const graphData = useMemo(() => {
    const nodes = books.map(b => ({
      id: b.id,
      name: b.title,
      color: b.coverColor,
      val: 2,
      ...b
    }));

    const links = [];
    // Link books in the series chronologically
    for (let i = 0; i < nodes.length - 1; i++) {
      links.push({
        source: nodes[i].id,
        target: nodes[i+1].id,
        color: 'rgba(150, 150, 150, 0.4)'
      });
    }

    return { nodes, links };
  }, [books]);

  return (
    <div className="plot-container" ref={containerRef}>
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        nodeRelSize={8}
        linkColor="color"
        linkWidth={2}
        onNodeClick={onBookSelect}
        onNodeHover={setHoverNode}
        backgroundColor="transparent"
      />
      {hoverNode && (
        <div 
          className="plot-tooltip"
          style={{ 
            left: '20px', 
            top: '20px'
          }}
        >
          <h4>{hoverNode.name}</h4>
          <div>{hoverNode.author} • {hoverNode.publicationYear}</div>
          <div style={{ marginTop: '4px', fontSize: '0.8rem', opacity: 0.8 }}>
            Click to view details
          </div>
        </div>
      )}
    </div>
  );
}
