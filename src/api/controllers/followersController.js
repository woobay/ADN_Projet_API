const Followers = require("../models/postFollowers");

exports.getAllFollowers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 25
    const page = parseInt(req.query.page) || 1

    if (isNaN(limit) || isNaN(page)) {
        res.status(400).send({
            errorCode: 'INVALID_PARAMETERS',
            message: 'Params for pagination must be Interger'
        })
        return
    }
    const amtOfFollowers = await Followers.countDocuments()

    try {
        return Followers.find()
        .skip(limit * page - limit)
        .limit(limit)
        .exec((err, followers) => {
            if (err) {
                res.status(500).send({
                    errorCode: "SERVER_ERROR",
                    message: 'An error occured while retriving followerss'
                })
                return
            } else {
                res.status(200).send({
                    message: 'POST_RETRIEVED_SUCCESSFULLY',
                    followers,
                    totalPages: Math.ceil(amtOfPost / limit)
                })
                return
            }
        })
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while retrieving posts'
          })
          return
    }
}


// exports.addPost = async (req,res) => {
//     try {
//         if (!req.body.title || !req.body.description || !req.body.created_by) {
//             res.status(400).send({
//                 errorCode: 'MISSING_PARAMETERS',
//                 message: 'Title, description and created_by are mendatory'
//             })
//             return
//         }

//         const post = new Post({ ...req.body})
//         post.save((err, post) => {
//             if (err) {
//               res.status(500).send({
//                   errorCode: "SERVER_ERROR",
//                   message: 'An error occured while adding the post'
//               })
//               return
//             } else {
//              res.status(200).send({
//                 message: 'POST_ADDED_SUCCESFULLY',
//                 post
//             })
//             return
//         }
//     })
 
//     } catch (e) {
//         res.status(500).send({
//             errorCode: 'SERVER_ERROR',
//             message: 'An error occurred while adding the post'
//         })
//         return
//     }
// }