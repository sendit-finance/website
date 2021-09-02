import Router from 'next/router'

function getFeatures() {
  if (Router.router?.query.feature) {
    return Router.router?.query.feature.split(',')
  }

  if (process.env.NEXT_PUBLIC_FEATURES) {
    return process.env.NEXT_PUBLIC_FEATURES.split(',')
  }

  if (typeof localStorage !== 'undefined') {
    const features = localStorage.getItem('features')
    if (features) return features.split(',')
  }

  return []
}

export default function hasFeature(name) {
  const features = getFeatures()
  return features.indexOf(name) > -1
}
