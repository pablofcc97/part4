const dummy = ( blogs ) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( (total, e ) => total+e.likes, 0)
}
const mostLikedBlog = (blogs) => {
  const ordered = blogs.sort( (a, b) => b.likes - a.likes)
  return {
    title: ordered[0].title,
    author: ordered[0].author,
    likes: ordered[0].likes
  }
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(e => e.author)

  const masRepetido = ar => ar.reduce((acum, el, i, ar) => {
    const count=ar.filter(e => e == el).length
    return count > acum[1] ? [el, count] : acum
  }, ['', 0]
  )
}

/*const palindrome = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length===0
    ? 0
    : array.reduce(reducer, 0) / array.length
}*/

module.exports = {
  dummy,
  totalLikes,
  mostLikedBlog,
  mostBlogs
}