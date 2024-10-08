import styles from './loading.module.css';

export const LoadingMfe = () => {
  return (
    <div className={styles['loading-spinner']}>
      <div className={styles.spinner}></div>
    </div>
  );
};
