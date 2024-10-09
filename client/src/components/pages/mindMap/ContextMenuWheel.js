import React from 'react';
import styles from './ContextMenuWheel.module.css';

const ContextMenuWheel = ({ x, y, options, onAction }) => {
	const radius = 50;
	const angleStep = (2 * Math.PI) / options.length;

	return (
		<div 
			className={styles.contextMenuWrapper} 
			style={{ 
				position: 'absolute',
				left: x,
				top: y,
				transform: 'translate(-50%, -50%)',
			}}
		>
			<svg width={radius * 2} height={radius * 2}>
				{options.map((option, index) => {
					const angle = index * angleStep - Math.PI / 2;
					const cx = radius + radius * Math.cos(angle);
					const cy = radius + radius * Math.sin(angle);

					return (
						<g key={option.name} onClick={() => onAction(option.action)}>
							<circle
								cx={cx}
								cy={cy}
								r={15}
								fill="#4a4a4a"
								className={styles.menuItem}
							/>
							<text
								x={cx}
								y={cy}
								textAnchor="middle"
								dominantBaseline="central"
								fill="white"
								fontSize="10"
							>
								{option.name[0].toUpperCase()}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
};

export default ContextMenuWheel;