import React from 'react';
import generateWheel from './lib/generate-wheel-svgs';

class Wheel extends React.Component {
  render () {
    let { sections: wheelData, width, height} = this.props;

    let sections = generateWheel({ sections: wheelData, width });

    let sectionsDom = sections.map(section => {
      let sectionDom = section.scenes.map(scene => {
        let textLines = scene.lines.map((line, i) => {
          return (
            <tspan key={i}
                   dy={i === 0 ? 0 : '1.2em'}
                   x={scene.textX}
                   alignmentBaseline={scene.alignmentBaseline}>
              {line}
            </tspan>
          )
        })

        return (
          <g className="scene" key={scene.id}>
            <line x1={scene.lineInnerX}
                  y1={scene.lineInnerY}
                  x2={scene.lineOuterX}
                  y2={scene.lineOuterY}
                  stroke="black"/>
            <text x={scene.textX}
                  y={scene.textY}
                  textAnchor={scene.textAnchor}>
                  {textLines}
            </text>
          </g>
        );
      });

      return (
        <g className="section">
          <path d={section.section}/>
          {sectionDom}
        </g>
      )
    });

    return (
      <div className="wheel-svg-container">
        <svg className="wheel-svg" width={width} height={height}>
          <g className="sections" style={{transform: `translate(${width / 2}px, ${height / 2}px)`}}>
            {sectionsDom}
          </g>
        </svg>
      </div>
    );
  }
}

export default Wheel;
