import React from 'react';
import styles from './TestButton.module.scss';

interface TestButtonProps {
    label: string;
onClick: () => void;
}

export const TestButton: React.FC<TestButtonProps> = ({ 
    label, onClick
}) => {
    return (
        <button className={styles.button} onClick={onClick}>
            {label}
        </button>
    );
};
