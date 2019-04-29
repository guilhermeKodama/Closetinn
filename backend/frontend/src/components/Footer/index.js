import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import styles from './styles'

import Facebook from '../Icons/Facebook'
import Instagram from '../Icons/Instagram'
import Pinterest from '../Icons/Pinterest'

const socials = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/meuclosetinn/',
    icon: <Facebook />
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/meuclosetinn/',
    icon: <Instagram />
  },
  {
    name: 'Pinterest',
    url: 'https://br.pinterest.com/meuclosetinn/',
    icon: <Pinterest />
  },
]

const Closetinn = ({ classes }) => (
  <Grid
    item
    xs={12}
    md={4}
  >
    <Typography
      className={classes.title}
      variant='subheading'
      align='center'
      color='inherit'
    >
        O <strong>CLOSETINN</strong> usa inteligência artificial para entender o seu estilo e recomendar somente peças que você pode gostar.
    </Typography>
  </Grid>
)

const Socials = ({ classes }) => {
  const renderSocial = ({ name, url, icon }) => (
    <Link
      className={classes.iconLink}
      key={name}
      aria-label={name}
      to={url}
      target='_blank'
    >
      {icon}
    </Link>
  )

  return (
    <Grid
      className={classes.gridItem}
      item
      xs={6}
      md={4}
    >
      <div>
        <Typography
          className={[classes.typography, classes.bold].join(' ')}
          variant='subheading'
          color='inherit'
        >
          Siga nas redes sociais
        </Typography>
        <Fragment>
          { socials.map(renderSocial) }
        </Fragment>
      </div>
    </Grid>
  )
}

const Footer = ({
  classes,
  className,
}) => (
  <footer className={classnames(classes.root)}>
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <Grid
          className={classes.grid}
          container
          spacing={24}
        >
          <Closetinn classes={classes} />
          <Socials classes={classes} />
        </Grid>
      </div>
    </div>
    <div className={classes.rights}>
      <div className={classes.content}>
        <Typography align='center' color='inherit'>© 2018 CLOSETINN</Typography>
      </div>
    </div>
  </footer>
)

export default withStyles(styles)(Footer)
