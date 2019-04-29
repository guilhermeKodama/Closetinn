export const loadState = key => {
  try {
    const serialized = localStorage.getItem(key)
    if (!serialized) return
    return JSON.parse(serialized)
  } catch (error) {
    return
  }
}

export const saveState = (key, state) => {
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem(key, serialized)
  } catch (error) {
    // Ignore errors
  }
}
