// pages/detail-ranking/detail-ranking.js
import create from 'mini-stores'
import discoveryStore from '../../stores/discoveryStore'

const stores = {
  $discovery: discoveryStore
}

create.Page(stores, {
  data: {}
})
