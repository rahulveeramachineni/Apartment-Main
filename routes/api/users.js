const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateFlatInput = require('../../validation/flat')
const validateLoginInput = require('../../validation/login');
const validateUpdateUserInput = require('../../validation/updateUser');
const validateFacilityInput = require('../../validation/facility');
const validateEmployeeInput = require('../../validation/employee');
const validateTenantInput = require('../../validation/tenant');

const EBEntry = require('../../models/EBEntry');
const User = require('../../models/User');
const Lab = require('../../models/Lab');
const Project = require('../../models/Project');
let lodash = require('lodash');
const Flat = require('../../models/Flat');
const Facility = require('../../models/Facility');
const Employee = require('../../models/Employee');
const Tenant = require('../../models/Tenant');
const BookingFacility = require('../../models/BookingFacility');

const ConsolidatedEBEntry = require('../../models/ConsolidatedEBEntry');


router.post(['/register','/user-add'], (req, res) => {
    console.log(req)
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                userPermission: req.body.userPermission
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            return res.status(200).json({message: 'User added successfully. Refreshing data...'})
                        }).catch(err => console.log("==="+err));
                });
            });
        }
    });
});

router.post('/flat-add', (req, res) => {
    const { errors, isValid } = validateFlatInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Flat.findOne({ flatNumber: req.body.flatNumber }).then(flat => {
        if (flat) {
            return res.status(400).json({ flatNumber: 'flat already exists' });
        } else {
            const newFlat = new Flat({
                flatOwnerName: req.body.flatOwnerName,
                flatNumber: req.body.flatNumber,
                flatOwnerNumber: req.body.flatOwnerNumber,
                flatOwnerProfession: req.body.flatOwnerProfession   
            });
            newFlat.save().then(flat => {
                return res.status(200).json({message: 'Flat added successfully. Refreshing data...'})
            }).catch(err => console.log(err));
        }
    });
});

router.post('/facility-add', (req, res) => {
    const { errors, isValid } = validateFacilityInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Facility.findOne({ facilityId: req.body.facilityId }).then(facility => {
        if (facility) {
            return res.status(400).json({ facilityId: 'facility Id already exists' });
        } else {
            const newFacility = new Facility({
                facilityId: req.body.facilityId,
                facilityName: req.body.facilityName,
                facilityManager: req.body.facilityManager,
                facilityManagerNumber: req.body.facilityManagerNumber,
                numberofPersonsAllowed: req.body.numberofPersonsAllowed   
            });
            newFacility.save().then(facility => {
                return res.status(200).json({message: 'Facility added successfully. Refreshing data...'})
            }).catch(err => console.log(err));
        }
    });
});

router.post('/employee-add', (req, res) => {
    const { errors, isValid } = validateEmployeeInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Employee.findOne({ employeeId: req.body.employeeId }).then(employee => {
        if (employee) {
            return res.status(400).json({ employeeId: 'employee Id already exists' });
        } else {
            const newEmployee = new Employee({
                employeeId: req.body.employeeId,
                employeeName: req.body.employeeName,
                phoneNumber: req.body.phoneNumber,
                profession: req.body.profession
            });
            newEmployee.save().then(facility => {
                return res.status(200).json({message: 'Employee added successfully. Refreshing data...'})
            }).catch(err => console.log(err));
        }
    });
});

router.post('/tenant-add', (req, res) => {
    const { errors, isValid } = validateTenantInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Tenant.findOne({ tenantId: req.body.tenantId }).then(tenant => {
        if (tenant) {
            return res.status(400).json({ tenantId: 'tenant already exists' });
        } else {
            const newTenant = new Tenant({
                tenantId: req.body.tenantId,
                tenantName: req.body.tenantName,
                flats: req.body.flats,
                phoneNumber: req.body.phoneNumber,
                numberOfPeople: req.body.numberOfPeople,
                profession: req.body.profession
            });
            newTenant.save().then(tenant => {
                return res.status(200).json({message: 'Tenant added successfully. Refreshing data...'})
            }).catch(err => console.log(err));
        }
    });
});

router.post('/booking-facility-add', (req, res) => {
    BookingFacility.findOne({ bookingId: req.body.bookingId }).then(bookingFacility => {
        if (bookingFacility) {
            return res.status(400).json({ bookingId: 'booking facility already exists' });
        } else {
            const newBookingFacility = new BookingFacility({
                bookingId: req.body.bookingId,
                facilitys: req.body.facilitys,
                email: req.body.email
            });
            newBookingFacility.save().then(bookingFacility => {
                return res.status(200).json({message: 'Booking done successfully. Refreshing data...'})
            }).catch(err => console.log(err));
        }
    });
});

router.post('/user-data', (req, res) => {
    User.find({}).select(['-password']).then(user => {
        if (user) {
            return res.status(200).send(user);
        }
    });
});

router.post('/flat-data', (req, res) => {
    Flat.find({}).then(flat => {
        if (flat) {
            return res.status(200).send(flat);
        }
    });
});

router.post('/available-flat-data', (req, res) => {
    var dbTenants = [];
    Tenant.find({})
        .then(data => {
            data.map((d, k) => {
                dbTenants.push(d.flats);
            })
            Flat.find({ _id: { $nin: dbTenants } })
                .then(data => {
                    return res.status(200).send(data);
                })
                .catch(error => {
                    console.log(error);
            })
        })
        .catch(error => {
            console.log(error);
        })
});

router.post('/facility-data', (req, res) => {
    Facility.find({}).then(facility => {
        if (facility) {
            return res.status(200).send(facility);
        }
    });
});

router.post('/employee-data', (req, res) => {
    Employee.find({}).then(employee => {
        if (employee) {
            return res.status(200).send(employee);
        }
    });
});

router.post('/tenant-data', (req, res) => {
    Tenant.find({}).populate('flats').exec((err, tenant) => {
        if (tenant) {
            return res.status(200).send(tenant);
        }
    });
});

router.post('/booking-facility-data', (req, res) => {
    BookingFacility.find({}).populate('facilitys').exec((err, bookingFacility) => {
        if (bookingFacility) {
            return res.status(200).send(bookingFacility);
        }
    });
});


/* EB calls */

router.get('/consolidated-eb-list', (req, res) => {
    console.log(req.query);
    const { labName } = req.query;
    const projectNo = req.body.projectNo;

    ConsolidatedEBEntry.find({lab: labName}).then( ebEntries => {
           
        if ( ebEntries ) {
            const projectsByNo = lodash.groupBy(ebEntries, 'projectNo');
            console.dir(projectsByNo);
            const entries = ebEntries.map( ebentry => {
                let { ebDate, ...rest} = ebentry;
       
                const ebDateObj = moment(ebDate);
                const { projectNo } = rest;
                const entry = Object.assign(ebentry, { ebDateStr: ebDateObj.format("DD/MM/YYYY") } );
                let ebNoAndEbDateStr = "";
                projectsByNo && projectsByNo[ebentry._doc.projectNo] && projectsByNo[ebentry._doc.projectNo].map( entry => {
                    const ebDate = moment(entry._doc.ebDate).format("DD/MM/YYYY");
                    ebNoAndEbDateStr = ebNoAndEbDateStr + "\n"+"EB-" + entry._doc.ebNumber  +":"+ ebDate;
                });

                const test = {
                    ...ebentry._doc,
                    ebDate: ebDateObj.format("DD/MM/YYYY"),
                    ebNoAndEbDateStr
                };

                console.log(test);
                return test;
            });
            
            return res.status(200).send(entries);

        }else{
            return res.status(200).send("No Eb list found");
        }
   
      
    });
});

router.get('/eb-due-list', (req, res) => {
    console.log(req.query);
    const { labName } = req.query;
    const projectNo = req.body.projectNo;

    EBEntry.find({lab: labName}).then( ebEntries => {

           
        if ( ebEntries ) {
            
            const entries = ebEntries.filter( ebentry => {
                let { ebDate } = ebentry;
       
                const ebDateObj = moment(ebDate);
                const today = moment();
                const days = today.diff(ebDate,"days");
                console.log( 'days diff b/w '+ ebDateObj.format("DD/MM/YYYY") + " "+today.format("DD/MM/YYYY") +days );

                if( days >= 180 ){
                    return true
                }else{
                    return false;
                }
        
            }).map( ebentry => {
                let { ebDate, ...rest} = ebentry;
       
                const ebDateObj = moment(ebDate);
                const entry = Object.assign(ebentry, {ebDateStr: ebDateObj.format("DD/MM/YYYY")})
                
                const test = {
                    ...ebentry._doc,
                    ebDate: ebDateObj.format("DD/MM/YYYY")
                };

                console.log(test);
                return test;
            });
            
            return res.status(200).send(entries);

        }else{
            return res.status(200).send("No due list found");
        }
   
      
    });
});

router.put('/update-eblist', (req, res) => {
    // const { errors, isValid } = validateUpdateUserInput(req.body);
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }
    console.log(req.body);
    const projectNo = req.body.projectNo;

    EBEntry.findOne({projectNo}).then( ebentry => {

        let {_id, ebDate, ...values} = req.body;
       
        const date = moment(ebDate, "DD/MM/YYYY");
        
        const consolidatedEBEntry =  new ConsolidatedEBEntry({...values}); 
        consolidatedEBEntry.save()
        .then( res => console.log('consolidated Eb Entry saved successfully..') )
        .catch( err => console.log(err.message) )
        
        if ( ebentry ) {
            
            EBEntry.updateOne({ _id: ebentry._id}, {$set: values}, { $setOnInsert: { ebDate: date.toDate() } }, function(err, result) {
                if (err) {
                    return res.status(400).json(err);
                } else {
                    return res.status(200).json({ message: 'EB Entry updated successfully.', success: true });
                }
            });

        }else{
            const ebentryObj =  new EBEntry({...values}); 
            ebentryObj.save()
            .then( res => res.status(200).json({ message: 'EB Entry saved successfully.', success: true }) )
            .catch( err => res.status(400).json(err) )
        }


    });
});

router.post('/eb-entry-delete', (req, res) => {
    EBEntry.deleteOne({ _id: req.body._id}).then(entry => {
        if (entry) {
            return res.status(200).json({message: 'Eb Entry deleted successfully. Refreshing data...', success: true})
        }
    });
});

router.post('/update-eblist', (req, res) => {
    // const { errors, isValid } = validateUpdateUserInput(req.body);
    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    let {_id, ...values} = req.body;
    const ebentry =  new EBEntry({...values}); 
    ebentry.save()
    .then( resp => res.status(200).json({ message: 'EB Entry saved successfully.Redirecting to Dashboard page..', success: true }) )
    .catch( err => res.status(400).json(err) )

});

router.get('/labs', (req, res) => {
    Lab.find({}).then(labs => {
        if (labs) {
            return res.status(200).send(labs);
        }
        else{
            return res.status(200).send('No Records for Labs');
        }
    });
});

router.get('/projects', (req, res) => {
    
    console.log(JSON.stringify(req.query));
    Project.find(req.query).then( projects => {
        if (projects) {
            return res.status(200).send(projects);
        }
        else{
            return res.status(200).send('No Records for projects');
        }
    });
});

router.post('/user-delete', (req, res) => {
    User.deleteOne({ _id: req.body._id}).then(user => {
        if (user) {
            return res.status(200).json({message: 'User deleted successfully. Refreshing data...', success: true})
        }
    });
});
router.post('/flat-delete', (req, res) => {
    Flat.deleteOne({ _id: req.body._id}).then(flat => {
        if (flat) {
            return res.status(200).json({message: 'Flat deleted successfully. Refreshing data...', success: true})
        }
    });
});
router.post('/facility-delete', (req, res) => {
    Facility.deleteOne({ _id: req.body._id}).then(facility => {
        if (facility) {
            return res.status(200).json({message: 'Facility deleted successfully. Refreshing data...', success: true})
        }
    });
});
router.post('/employee-delete', (req, res) => {
    Employee.deleteOne({ _id: req.body._id}).then(employee => {
        if (employee) {
            return res.status(200).json({message: 'Employee deleted successfully. Refreshing data...', success: true})
        }
    });
});
router.post('/tenant-delete', (req, res) => {
    Tenant.deleteOne({ _id: req.body._id}).then(tenant => {
        if (tenant) {
            return res.status(200).json({message: 'Tenant deleted successfully. Refreshing data...', success: true})
        }
    });
});

router.post('/user-update', (req, res) => {
    const { errors, isValid } = validateUpdateUserInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    User.findOne({ _id }).then( user => {
        if (user) {
            if (req.body.password !== '') {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                    });
                });
            }
            let update = {'name': req.body.name, 'email': req.body.email, 'password': user.password, 'userPermission': req.body.userPermission};
            User.update({ _id: _id}, {$set: update}, function(err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update user.' });
                } else {
                    return res.status(200).json({ message: 'User updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'Now user found to update.' });
        }
    });
});
router.post('/flat-update', (req, res) => {
    const { errors, isValid } = validateFlatInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    Flat.findOne({ _id }).then( flat => {
        if (flat) {
            let update = {'flatNumber': req.body.flatNumber, 'flatOwnerName': req.body.flatOwnerName, 'flatOwnerNumber': req.body.flatOwnerNumber, 'flatOwnerProfession': req.body.flatOwnerProfession};
            Flat.update({ _id: _id}, {$set: update}, function(err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update Flat.' });
                } else {
                    return res.status(200).json({ message: 'Flat updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'No flat found to update.' });
        }
    });
});
router.post('/facility-update', (req, res) => {
    const { errors, isValid } = validateFacilityInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    Facility.findOne({ _id }).then( facility => {
        if (facility) {
            let update = {'facilityId': req.body.facilityId, 'facilityName': req.body.facilityName, 'facilityManager': req.body.facilityManager, 'facilityManagerNumber': req.body.facilityManagerNumber, 'numberofPersonsAllowed': req.body.numberofPersonsAllowed};
            Facility.update({ _id: _id}, {$set: update}, function(err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update Facility.' });
                } else {
                    return res.status(200).json({ message: 'Facility updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'No facility found to update.' });
        }
    });
});
router.post('/employee-update', (req, res) => {
    const { errors, isValid } = validateEmployeeInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    Employee.findOne({ _id }).then( employee => {
        if (employee) {
            let update = {'employeeId': req.body.employeeId, 'employeeName': req.body.employeeName, 'phoneNumber': req.body.phoneNumber, 'profession': req.body.profession};
            Employee.update({ _id: _id}, {$set: update}, function(err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update Employee.' });
                } else {
                    return res.status(200).json({ message: 'Employee updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'No Employee found to update.' });
        }
    });
});
router.post('/tenant-update', (req, res) => {
    const { errors, isValid } = validateTenantInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const _id = req.body._id;
    Tenant.findOne({ _id }).then( tenant => {
        if (tenant) {
            let update = {'tenantId': req.body.tenantId, 'tenantName': req.body.tenantName, 'phoneNumber': req.body.phoneNumber, 'profession': req.body.profession, 'numberOfPeople': req.body.numberOfPeople};
            Tenant.update({ _id: _id}, {$set: update}, function(err, result) {
                if (err) {
                    return res.status(400).json({ message: 'Unable to update Tenant.' });
                } else {
                    return res.status(200).json({ message: 'Tenant updated successfully. Refreshing data...', success: true });
                }
            });
        } else {
            return res.status(400).json({ message: 'No Tenant found to update.' });
        }
    });
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ email: 'Email not found' });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name
                };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            userPermission: user.userPermission,
                            token: 'Bearer ' + token,
                            email: user.email
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ password: 'Password incorrect' });
            }
        });
    });
});


module.exports = router;
