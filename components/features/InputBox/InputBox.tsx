import styles from './InputBox.module.css'


export default function InputBox(props: any) {
    return (
        <input
        type="text"
        className={styles.inputbox + " " + props.style}
        id={props.id}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    );
  }