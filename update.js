monDb.collection.updateOne(
    {"_id": ObjectId(req.params.id)}, 
    { $set: updateDoc }, 
    function(err, doc) 
        { "_id": req.body._id}, // Filter
        {"c-id": req.body.courseID}, // Update
        {"c-title": req.body.courseTitle},
        {"c-subject": req.body.subject},
        {"c-description": req.body.description},
        {"c-credits": req.body.credits}
    )
    .then((obj) => {
        console.log('Updated - ' + obj);
        res.redirect('courses')
    })
    .catch((err) => {
        console.log('Error: ' + err);
    })