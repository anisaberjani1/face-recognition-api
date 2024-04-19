
const handleRegister = (req, res,db,bcrypt) => {
    console.log('Received registration request:', req.body);

    const {email, name, password} =  req.body;

    if(!email || !name || !password){
        return res.status(400).json('incorrect form submisiion');
    }

    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                    email: loginEmail[0],
                    name:name,
                    joined: new Date()
                })
                .then(user => {
                    console.log('User registered successfully:', user[0]);
                    res.json(user[0]);
                })
                .catch(err => {
                    console.error('Error inserting user into users table:', err);
                    trx.rollback();
                    res.status(500).json('Unable to register');
                });
            })
            .then(trx.commit)
            .catch(err => {
                console.error('Error inserting email into login table:', err);
                trx.rollback();
                res.status(500).json('Unable to register');
            });
        })
        .catch(err => {
            console.error('Transaction error:', err);
            res.status(500).json('Unable to register');
        }); 
}

module.exports = {
    handleRegister: handleRegister
}