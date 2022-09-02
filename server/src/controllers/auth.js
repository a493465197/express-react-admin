const models = require('../models')

/* Create a new session for a user */
const createSession = async (request, response) => {

    const session = new models.Session({
        username: request.body.username,
        password: request.body.password,
    })

    const returned = await session.save()
        .catch((err) => {
            response.json({"status": "username taken"})
        })

    if (returned) {
        if (session._id) {
            response.json({
                status: "success",
                username: returned.username,
                token: returned._id
            })
        }
    }
}
const setInfo = async (request, response) => {

    const authHeader = request.get('Authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('basic ')) {
        const token = authHeader.substring(6)
        try {
            // this will throw an error if token isn't of the right format
            const match = await models.Session.findById(token)  
            console.log(request.body)
            if (request.body.currUser) {
                await models.Session.updateOne({username: request.body.currUser},request.body)

            } else {
                await models.Session.updateOne({_id: match._id.toString()},request.body)

            }
            response.json({status: "success"}) 
            return
        } catch (e) { console.log(e)}

    }
    response.json({status: "unregistered"}) 
}
const userList = async (request, response) => {

    const authHeader = request.get('Authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('basic ')) {
        const token = authHeader.substring(6)
        try {
            // this will throw an error if token isn't of the right format
            const match = await models.Session.find()  
            response.json({status: "success",value: match}) 
            return
        } catch { }

    }
    response.json({status: "unregistered"}) 
}
const delUser = async (request, response) => {

    const authHeader = request.get('Authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('basic ')) {
        const token = authHeader.substring(6)
        try {
            // this will throw an error if token isn't of the right format
            const match = await models.Session.deleteOne({username: request.body.username})  
            response.json({status: "success"}) 
            return
        } catch { }

    }
    response.json({status: "unregistered"}) 
}
const login = async (request, response) => {

    const session = await models.Session.findOne({password: request.body.password,username: request.body.username})

        if (session && session._id) {
            response.json({
                status: "success",
                username: session.username,
                token: session._id
            })
        } else {
            response.json({status: "unregistered"}) 

        }

}


const getUser = async (request, response) => {

    const authHeader = request.get('Authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('basic ')) {
        const token = authHeader.substring(6)
        try {
            // this will throw an error if token isn't of the right format
            const match = await models.Session.findById(token)
            // match._id = match._id.toString()
            if (match) {
                response.json({
                    status: "success",
                    username: match.username,
                    token: match._id,
                    ...match._doc
                    
                })     
                return  
            }
        } catch { }

    }
    response.json({status: "unregistered"}) 
}

/* 
 * validUser - check for a valid user via Authorization header
 *   return the username if found, false if not
*/
const validUser = async (request) => {
    
    const authHeader = request.get('Authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('basic ')) {
        const token = authHeader.substring(6)        
        const match = await models.Session.findOne({_id: token})  

        if (match) {
            return match._id
        }
    } 
    return false
}

module.exports = { validUser, getUser, createSession,login,setInfo,userList,delUser }
