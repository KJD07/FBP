

//    THIS WILL RUN IN NODE 18.16.1
//


const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const app = express();
const port = 8000;
const nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var config = {
  user: 'sa',
  password: 'Server@2000',
  server: 'DESKTOP-IR17DEV\\SQLEXPRESS',
  database: 'fbpDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  },
};


const db = sql.connect(config, function (err) {
  if (err) throw err;
  console.log("Database Connected");
});

/// THIS IS TO ACCEPT OR REJECT THE FBP PLANS *******************************************************

app.post("/changePlans", async function (req, res) {
  const request = db.request();

  request
    .input("EMPLOYEE_ID", sql.Char(10), req.body.Employee_Id)
    .input("ANS", sql.Bit, req.body.ans)

  const fetchQuery = "SELECT fbp FROM hemployee WHERE emp_cd = @EMPLOYEE_ID";
  const fetchResult = await request.query(fetchQuery);
  const currentFbpValue = fetchResult.recordset[0].fbp;

  if (currentFbpValue === null) {
    const q = "UPDATE hemployee SET fbp = @ANS WHERE emp_cd = @EMPLOYEE_ID";
    const result = await request.query(q);
    res.json({ success: true, msg: "Data Changed Successfully" });
    console.log("results", result);
  } else {
    res.json({ success: false, msg: "fbp is not null, cannot update" });
    console.log("fbp is not null, cannot update");
  }
});

app.post('/fetchUpdatedBills', async (req, res) => {
  const { Employeer_Id, fbp } = req.body;

  const request = db.request();
  request.input('Employeer_Id', sql.Char(10), Employeer_Id);
  request.input('fbp', sql.Char(10), fbp);

  try {
    // Query to fetch the updated list of bills based on Employeer_Id and typ
    const query = 'SELECT * FROM hbill WHERE employeer_id = @Employeer_Id AND fbp = @fbp AND approved IS NULL';
    const result = await request.query(query);

    // Send the updated list of bills in the response
    res.json({ success: true, userDetails: result.recordset });
  } catch (error) {
    console.error('Error fetching updated bills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/sendEmail', async (req, res) => {
  const { recipient, subject, body } = req.body;

  try {
    // Create a nodemailer transporter using your email service details
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kanan07linkedin@gmail.com', // Change this to your email address
        pass: 'JOBS@kanan07', // Change this to your email password
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Kanan Jindal" <kanan07linkedin@gmail.com>', // Sender address
      to: recipient, // List of recipients
      subject: subject, // Subject line
      text: body, // Plain text body
    });

    console.log('Email sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

//// THIS IS THE METHOD TO POST THE BILL IN MSSQL SERVER **********************************************



//// THIS IS THE METHOD TO DISABLE THE ACCEPT AND REJECT BUTTON **********************************************

app.post("/fetchCurrentFbpValue", async function (req, res) {
  const request = db.request();
  request.input("EMPLOYEE_ID", sql.Char(10), req.body.Employee_Id);
  const fetchQuery = "SELECT carfbp FROM hemployee WHERE emp_cd = @EMPLOYEE_ID";
  const fetchQuery1 = "SELECT fbp FROM hemployee WHERE emp_cd = @EMPLOYEE_ID";
  
  try {
    const fetchResult = await request.query(fetchQuery);
    const fetchResult1 = await request.query(fetchQuery1);
    const currentFbpValue = fetchResult.recordset[0].carfbp;
    const currentFbpValue1 = fetchResult1.recordset[0].fbp;
    res.json({ currentFbpValue, currentFbpValue1 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching currentFbpValue" });
  }
});

app.post("/fetchCurrentValue", async function (req, res) {
  const request = db.request();
  request.input("EMPLOYEE_ID", sql.Char(10), req.body.Employee_Id);
  const fetchQuery1 = "SELECT fbp FROM hemployee WHERE emp_cd = @EMPLOYEE_ID";
  const fetchQuery = "SELECT carfbp FROM hemployee WHERE emp_cd = @EMPLOYEE_ID";
  try {
    const fetchResult = await request.query(fetchQuery);
    const fetchResult1 = await request.query(fetchQuery1);
    const currentFbpValue = fetchResult.recordset[0].carfbp;
    const currentFbpValue1 = fetchResult1.recordset[0].fbp;
    res.json({ currentFbpValue, currentFbpValue1 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching currentFbpValue" });
  }
});

///  THIS IS TO ACCEPT OR REJECT THE FBP PLANS FOR A CAR *******************************************************

app.post("/changePlansCar", async function (req, res) {
  const request = db.request();

  request
    .input("EMPLOYEE_ID", sql.Char(10), req.body.Employee_Id)
    .input("ANS", sql.Bit, req.body.ans)

  const fetchQuery = "SELECT carfbp FROM hemployee WHERE emp_cd = @EMPLOYEE_ID";
  const fetchResult = await request.query(fetchQuery);
  const currentFbpValue = fetchResult.recordset[0].carfbp;

  if (currentFbpValue === null) {
    const q = "UPDATE hemployee SET carfbp = @ANS WHERE emp_cd = @EMPLOYEE_ID";
    const result = await request.query(q);
    res.json({ success: true, msg: "Data Changed Successfully" });
    console.log("results", result);
  } else {
    res.json({ success: false, msg: "fbp is not null, cannot update" });
    console.log("fbp is not null, cannot update");
  }


})

/// THIS CODE IS FOR LOGGING IN FROM THE MAIN PAGE ************************************************

app.post("/saveUser", async function (req, res) {
  const request = db.request();

  request
    .input("EMPLOYEE_ID", sql.Char(10), req.body.employeeID)
    .input("PASSWORD", sql.VarChar(50), req.body.password)

  const q = "SELECT A.EMP_CD,A.EMP_NM,A.DEPT_CD,A.DESIG_CD,B.DEPT_NM ,C.DESIG_nM,D.CATG_NM ,E.* FROM HEMPLOYEE A INNER JOIN HDEPT B ON A.DEPT_CD = B.DEPT_CD INNER JOIN HDESIG C ON A.DESIG_CD = C.DESIG_CD INNER JOIN HCATG D ON C.DESIG_CATG = D.CATG_CD  INNER JOIN HFBP_MAST E ON D.CATG_NM=E.GRADE AND (E.TYP = 'CAR' OR E.TYP='FBP') WHERE A.EMP_CD = @EMPLOYEE_ID";
  const result = await request.query(q);
  console.log("results", result);

  if (result.recordset.length > 0) {
    const userDetails = result.recordset.map(user =>({
      EMP_CD: user.EMP_CD,
      EMP_NM: user.EMP_NM,
      DEPT_NM: user.DEPT_NM,
      DESIG_nM: user.DESIG_nM,
      grade: user.grade,
      fbp_val: user.fbp_val,
      typ: user.typ
    }));
    res.json({ success: true, msg: "Authentication successful", userDetails });
  } else {
    res.json({ success: false, msg: "Authentication failed" });
  }

})

app.post("/submitBill", async (req, res) => {
  const request = db.request();
  // const { Supplier, Bill} = req.body;
  request
    .input("SUPPLIER_NAME", sql.Char(50), req.body.Supplier)
    .input("BILL_NUMBER", sql.Char(50), req.body.Bill)
    .input("DATE", sql.Char(30), req.body.Date)
    .input("AMOUNT", sql.Char(50), req.body.Amount)
    .input("ID", sql.Char(50), req.body.Employeer_Id)
    .input("TYPE", sql.Char(50), req.body.typ)

  try {
    const checkQuery = "SELECT COUNT(*) AS count FROM hbill WHERE bill_number = @BILL_NUMBER AND supplier_name = @SUPPLIER_NAME";
    const userCheckQuery = "SELECT A.EMP_CD,A.EMP_NM,A.DEPT_CD,A.DESIG_CD,B.DEPT_NM ,C.DESIG_nM,D.CATG_NM ,E.* FROM HEMPLOYEE A INNER JOIN HDEPT B ON A.DEPT_CD = B.DEPT_CD INNER JOIN HDESIG C ON A.DESIG_CD = C.DESIG_CD INNER JOIN HCATG D ON C.DESIG_CATG = D.CATG_CD  INNER JOIN HFBP_MAST E ON D.CATG_NM=E.GRADE AND (E.TYP = 'CAR' OR E.TYP='FBP') WHERE A.EMP_CD = @ID";
    const userCheckResult = await request.query(userCheckQuery);
    const checkResult = await request.query(checkQuery);
    const existingCount = checkResult.recordset[0].count;
    console.log("results", userCheckResult);
    const userDetails = userCheckResult.recordset.map(user =>({
      EMP_CD: user.EMP_CD,
      EMP_NM: user.EMP_NM,
      DEPT_NM: user.DEPT_NM,
      DESIG_nM: user.DESIG_nM,
      grade: user.grade,
      fbp_val: user.fbp_val,
      typ: user.typ
    }));

    if(existingCount===0){
      await request.query(`INSERT INTO hbill ( fbp, employeer_id, supplier_name, bill_number, date, amount) VALUES ( @TYPE, @ID, @SUPPLIER_NAME, @BILL_NUMBER, @DATE, @AMOUNT )`);
      res.status(200).json({ success: true, userDetails });
    }else{
      res.status(400).json({ success: false, msg: "A bill with the same bill number and date already exists" });
    }
    

  } catch (error) {
    console.error('Error submitting data to MSSQL Server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/// THIS IS FOR THE LOGIN OF HRM ONLY *********************************************************

app.post("/loginAdmin", async function (req, res) {
  const { HRM, Password } = req.body;

  if (HRM==='HRML' && Password==='hrml') {
    res.json({ success: true, msg: "Authentication successful" });
  } else {
    res.json({ success: false, msg: "Authentication failed" });
  }

})



//// ******************************************************************************************

app.post("/listClothes", async function (req, res) {
  // await sql.connect(config);
  const request = db.request();

  const q = "SELECT fbp, employeer_id, supplier_name, bill_number, date, approved, amount FROM hbill WHERE fbp = 'FBP' AND approved IS NULL"
  const result = await request.query(q);
  console.log("results", result);


  if (result.recordset.length > 0) {
    const userDetails = result.recordset.map(user =>({
      fbp: user.fbp,
      employeer_id: user.employeer_id,
      supplier_name: user.supplier_name,
      bill_number: user.bill_number,
      date: user.date,
      amount: user.amount,
      approved: user.approved
    }));
    res.json({ success: true, msg: "Authentication successful", userDetails});
  } else {
    res.json({ success: false, msg: "Authentication failed" });
  }

})

//// ******************************************************************************************

app.post("/listCar", async function (req, res) {
  // await sql.connect(config);
  const request = db.request();

  const q = "SELECT fbp, employeer_id, supplier_name, bill_number, date, amount, approved FROM hbill WHERE fbp = 'CAR' AND approved IS NULL"
  const result = await request.query(q);
  console.log("results", result);

  if (result.recordset.length > 0) {
    const userDetails = result.recordset.map(user =>({
      fbp: user.fbp,
      employeer_id: user.employeer_id,
      supplier_name: user.supplier_name,
      bill_number: user.bill_number,
      date: user.date,
      amount: user.amount,
      approved: user.approved
    }));
    res.json({ success: true, msg: "Authentication successful", userDetails});
  } else {
    res.json({ success: false, msg: "Authentication failed" });
  }

})


app.post("/updateApprovalStatus", async function (req, res) {
  const request = db.request();

  request
    .input("Bill", sql.Char(50), req.body.Bill)
    .input("action", sql.Bit, req.body.action)
    .input("amount", sql.Char(50), req.body.amount)

  const q = "UPDATE hbill SET approved = @action, amount = @amount WHERE bill_number = @Bill";
  try {
    const result = await request.query(q);
    console.log("results", result);

    if (result.rowsAffected[0] > 0) {
      res.json({ success: true, msg: "Update successful" });
    } else {
      res.json({ success: false, msg: "Update failed" });
    }
  } catch (error) {
    console.error("Error updating approval status:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }

})

app.post("/updateApprovalStatusBatch", async function (req, res) {
  const request = db.request();

  const promises = req.body.selectedRows.map(async (billNumber) => {
    request.input("Bill", sql.Char(50), billNumber);
    request.input("Action", sql.Bit, true); // Assuming all selected bills are accepted
    return await request.query("UPDATE hbill SET approved = @Action WHERE bill_number = @Bill");
  });

  try {
    const results = await Promise.all(promises);
    const approvedStatus = results.map(result => result.rowsAffected[0] > 0);
    res.json({ success: true, approved: approvedStatus });
  } catch (error) {
    console.error("Error updating approval status:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});


// ... (your existing imports)

app.post('/getSubmittedBills', async (req, res) => {
  const { Employeer_Id,typ } = req.body;

  const request = db.request();
  request.input('Employeer_Id', sql.Char(10), Employeer_Id);
  request.input('typ', sql.Char(10), typ);

  try {
    const query = 'SELECT * FROM hbill WHERE employeer_id = @Employeer_Id AND fbp = @typ';
    const result = await request.query(query);
    res.json({ submittedBills: result.recordset });
  } catch (error) {
    console.error('Error fetching submitted bills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/getAcceptedBills', async (req, res) => {
  const { Employeer_Id,typ  } = req.body;

  const request = db.request();
  request.input('Employeer_Id', sql.Char(10), Employeer_Id);
  request.input('typ', sql.Char(10), typ);

  try {
    const query = 'SELECT * FROM hbill WHERE employeer_id = @Employeer_Id AND fbp = @typ AND approved = 1';
    const result = await request.query(query);
    res.json({ acceptedBills: result.recordset });
  } catch (error) {
    console.error('Error fetching accepted bills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/getRejectedBills', async (req, res) => {
  const { Employeer_Id,typ  } = req.body;

  const request = db.request();
  request.input('Employeer_Id', sql.Char(10), Employeer_Id);
  request.input('typ', sql.Char(10), typ);

  try {
    const query = 'SELECT * FROM hbill WHERE employeer_id = @Employeer_Id AND fbp = @typ AND approved = 0';
    const result = await request.query(query);
    res.json({ rejectedBills: result.recordset });
  } catch (error) {
    console.error('Error fetching rejected bills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ... (your existing endpoints)




///  HERE EVERYTHING ENDS AND ONLY SOME CONNECTION AT THE END ***********************************************


app.listen(port, function () {
  console.log(`Server is listening at port ${port}`);
})