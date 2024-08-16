import React, {FC} from 'react';
import styles from "./ModalStyle.module.scss"
interface Props {
    closeModal: () => void;
    isOpen: boolean;
    children: React.ReactNode;
}

const Modal: FC<Props> = ({isOpen, closeModal, children}) => {
    if (!isOpen) return null;

    return (
        <>
            <div className={styles.backdrop} onClick={closeModal} />
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={closeModal}>×</button>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Modal;