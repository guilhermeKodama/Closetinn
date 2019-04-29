import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles'

import Slider from '../../components/Slider'
import PromotionGrid from '../../components/PromotionGrid'
import Banner from '../../components/Banner'

import { getPromotions } from '../../modules/promotions/actions'

import { loggedSelector } from '../../modules/user/selectors'
import { categoriesSelector } from '../../selectors/cloth'
import { promotionsSelector } from '../../selectors/promotions'

import config from '../../config'

const images = [
  {
    label: 'Monte seus looks com peças das melhores lojas da internet',
    url: {
      x1: `${config.apiBaseUrl}/banner1.jpg`,
      x2: `${config.apiBaseUrl}/banner1@2x.jpg`,
      x3: `${config.apiBaseUrl}/banner1@3x.jpg`,
    }
  },
  {
    label: 'Todas as ofertas da internet em um só lugar!',
    url: {
      x1: `${config.apiBaseUrl}/banner2.jpg`,
      x2: `${config.apiBaseUrl}/banner2@2x.jpg`,
      x3: `${config.apiBaseUrl}/banner2@3x.jpg`,
    }
  },
  {
    label: 'CLOSETINN é o seu closet virtual com as roupas que você sempre sonhou',
    url: {
      x1: `${config.apiBaseUrl}/banner3.jpg`,
      x2: `${config.apiBaseUrl}/banner3@2x.jpg`,
      x3: `${config.apiBaseUrl}/banner3@3x.jpg`,
    }
  }
]

const background = {
  x1: `${config.apiBaseUrl}/banner4.jpg`,
  x2: `${config.apiBaseUrl}/banner4@2x.jpg`,
  x3: `${config.apiBaseUrl}/banner4@3x.jpg`,
}

class HomeView extends PureComponent {
  state = {
    activeStep: 0,
    currentPage: 1,
    offset: 4,
  }

  componentDidMount() {
    document.title = 'Home - Todas as Ofertas da Internet em Um Só Lugar | Closetinn'
    const { getPromotions } = this.props,
          { currentPage, offset } = this.state
    getPromotions({ currentPage, offset })
  }

  /**
   * Handle functions
   */

  handleStepChange = activeStep => {
    this.setState(() => ({ activeStep }))
  }

  handlePromotionClick = (e, offer, index) => {
    const { history } = this.props
    history.push(`/promotions/${offer._id}`)
  }

  handleShowAllClick = e => {
    const { history } = this.props
    history.push('/promotions')
  }

  handleBannerClick = e => {
    const { logged, history } = this.props
    const path = logged ? '/closet' : '/signin'
    history.push(path)
  }

  render() {
    const { classes, promotions } = this.props,
          { activeStep } = this.state

    return (
      <main className={classes.root}>
        <Slider
          images={images}
          activeStep={activeStep}
          onStepChange={this.handleStepChange}
          interval={5000}
        />
        {
          !!promotions.length &&
          <PromotionGrid
            className={classes.promotionGrid}
            promotions={promotions}
            onShowAll={this.handleShowAllClick}
            onPromotion={this.handlePromotionClick}
          />
        }
        <Banner
          className={classes.banner}
          background={background}
          label='Crie um closet e comece a salvar suas roupas favoritas'
          buttonLabel='Criar um closet'
          onClick={this.handleBannerClick}
        />
      </main>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  logged: loggedSelector(),
  categories: categoriesSelector(),
  promotions: promotionsSelector(),
})

const mapDispatchToProps = dispatch => ({
  getPromotions: params => dispatch(getPromotions(params)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(HomeView))
