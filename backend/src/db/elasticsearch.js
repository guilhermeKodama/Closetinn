import elasticsearch from 'elasticsearch'
import config from '../../config'

const { host } = config.elasticSearch

const client = new elasticsearch.Client({ host })

export default client
