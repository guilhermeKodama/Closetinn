
module.exports = {
  normalizeCategory(category) {
    category = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    return category
  }
}
