const styles = theme => ({
  scroll: {
    padding: 2,
    scrollSnapType: 'x mandatory',
    overflow: 'auto',
    whiteSpace: 'nowrap',
  },
  item: {
    display: 'inline-block',
    scrollSnapAlign: 'start',
    marginRight: theme.spacing.unit,
  },
})

export default styles
