import React from 'react'
import styles from './styles.js'
import Card from '@material-ui/core/Card'
import { withStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const ClosetFolder = ({ classes, type, editMode, disable, folder, title, cover, onSelect, onDelete, onEdit }) => {
  const onSelectClick = e => {
    if (!disable) {
      if (folder) {
        onSelect(e, folder._id)
      } else {
        onSelect(e)
      }
    }
  }

  const onDeleteClick = e => {
    e.stopPropagation()
    if (!disable) {
      onDelete(e, folder)
    }
  }

  const onEditClick = e => {
    e.stopPropagation()
    if (!disable) {
      onEdit(e, folder)
    }
  }

  return (
    <Card className={classes.card} onClick={onSelectClick}>
      <CardContent className={classes.cardContent}>
        <Typography variant="headline" component="h2">
           {type === 'create' ? title : folder.folderName}
         </Typography>
      </CardContent>
      {
        type !== 'create' && editMode &&
        <CardActions>
          <Button size="small" color="primary" onClick={onDeleteClick}>
            Remover
          </Button>
          <Button size="small" color="primary" onClick={onEditClick}>
            Editar
          </Button>
          {
            /*
            <Button size="small" color="primary" onClick={onEditClick}>
              Editar
            </Button>
             */
          }
        </CardActions>
      }
    </Card>
  )
}

ClosetFolder.defaultProps = {
  editMode: false,
  disable: false,
  type: ''
}

export default withStyles(styles)(ClosetFolder)
