const actions = (store) => ({
  updateSetting: async (state, key, value) => {
    await store.setState({
      [key]: value
    })
  }
})

export default actions
