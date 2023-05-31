const logger = require('./logger')
const jwt = require('jsonwebtoken')

/*MIDLEWARE POR LO GENERAL RECIBEN 3 PARAMETROS */
/*EL PARAMETRO NEXT, DECIDE SI CONTINUA AL PROXIMO MIDDLEWARE O AL CONTROLADOR O ENVIA UN ERROR */
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError'){
    return response.status(401).json({ error:error.message })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {

  const authorization = request.get('authorization')
  const token = (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null

  //console.log(`TOKEN ENVIADO ${token}`)
  //OBTINENE UN OBJETO CON EL NOMBRE DE USUARIO, EL ID Y UNA VALOR IAT
  const decodedToken = jwt.verify(token, process.env.SECRET)//AQUI EL ERROR. NO SIGUE Y DEVUELVE ERROR QUE ES PROCESS .ENV SECRET
  //console.log(`OBJETO USUARIO AUTENTIFICADO ${decodedToken}`)
  //console.log(`OBJETO USUARIO AUTENTIFICADO ID ${decodedToken.id}`)

  /*PUEDEN HABER VARIOS TOKENS VALIDOS PARA UN USUARIO CONTRASEÑA. UN TOKEN DE UNA SESIÓN PASADA FUNCIONA CORRECTAMENTE */
  if(!token || !decodedToken.id){
    //console.log('NO SE AUTENTICO')
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  //console.log('SE AUTENTICO')
  request.token = decodedToken

  next()
}

const userExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  const token = (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null


  const decodedToken = jwt.verify(token, process.env.SECRET)

  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  request.user = decodedToken.id

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}