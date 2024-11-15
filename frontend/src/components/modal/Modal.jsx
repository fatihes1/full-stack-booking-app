import './Modal.css'
export const Modal = (props) => {
  return (
    <div className={'modal'}>
      <header className={'modal__header'}>
        <h1>{props.title}</h1>
      </header>
      <section className={'modal__content'}>{props.children}</section>
      <section className={'modal__actions'}>
        {props.canCancel && (
          <button onClick={props.onCancel} className={'btn'}>
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button onClick={props.onConfirm} className={'btn'}>
            {props.confirmText}
          </button>
        )}
      </section>
    </div>
  )
}
