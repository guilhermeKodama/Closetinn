import React, { Component } from 'react'
import styles from './CreateFolderModal.scss'

class CreateFolderModal extends Component {
  state = {
    folderName: '',
    folderDescription: ''
  }

  onFolderNameChange = e => {
    const folderName = e.target.value
    this.setState(() => ({ folderName }))
  }

  onFolderDescriptionChange = e => {
    const folderDescription = e.target.value
    this.setState(() => ({ folderDescription }))
  }

  onSaveFolderClick = e => {
    const { folderName, folderDescription } = this.state
    this.props.onSaveFolder(e, folderName, folderDescription)
  }

  renderEmoji = () => {
    const emojis = ['👚', '👖', '🧦', '👙', '🧤', '🧢']
    return emojis.map((emoji, index) => <button key={index} className={styles.buttonEmoji}>{emoji}</button>)
  }

  render() {
    return (
      <div className={styles.CreateFolderModal}>
        <div className={styles.titleWrapper}>
          <p className={styles.title}>Um NICHO é um espacinho no seu Guarda-roupas virtual para "guardar" as brusinhas que você deseja</p>
          <div className={styles.divider}/>
        </div>
        <div>
          <p className={styles.secondaryTitle}>Qual vai ser o nome deste NICHO?</p>
          <input className={styles.input} autoFocus placeholder='Ex.: Brusinhas maneiras' value={this.state.folderName} onChange={this.onFolderNameChange}/>
        </div>
        <div>
          <p className={styles.secondaryTitle}>Descrição do NICHO</p>
          <input className={styles.input} placeholder='Ex.: Brusinhas descoladas para curtir o rolê' value={this.state.folderDescription} onChange={this.onFolderDescriptionChange}/>
        </div>
        {/* <div>
          <p className={styles.secondaryTitle}>Escolha um ícone relacionado</p>
          <div className={styles.emojiWrapper}>
            {
              this.renderEmoji()
            }
          </div>
        </div> */}
        <button className={styles.button} onClick={this.onSaveFolderClick}>Salvar</button>
      </div>
    )
  }
}

export default CreateFolderModal
