const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if(authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodeToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  request.user = await User.findById(decodeToken.id)

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.code === 11000) {
    return response.status(409).json({ error: 'username already exists' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  errorHandler, tokenExtractor, userExtractor
}