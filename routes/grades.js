import express from "express";
import { promises } from "fs";

const fs = promises;
const router = express.Router();

//POST - Return a new grade created
router.post("/", async (req, res) => {
  let grade = req.body;
  try {
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let json = JSON.parse(data);

    grade = { id: json.nextId++, ...grade, timestamp: new Date() };
    json.grades.push(grade);
    delete grade.nextId;

    await fs
      .writeFile(gradesFileJSON, JSON.stringify(json))
      .then(() => {
        logger.info(`POST /grades - ${JSON.stringify(grade)}`);
        res.send(grade);
      })
      .catch((err) => {
        logger.error(`POST /grades - ${err.message}`);
        res.status(400).send({ error: err.message });
      });
  } catch (err) {
    logger.error(`POST /grades - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

//PUT - Return a grade updated passing by id
router.put("/:id", async (req, res) => {
  try {
    let { student, subject, type, value } = req.body;
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let result = JSON.parse(data);
    let id = Number(req.param("id"));

    const findGrade = result.grades.findIndex((grade) => grade.id === id);
    if (findGrade === -1) {
      logger.error(`PUT /grades/:id - Grade Not Found`);
      res.status(400).send({ error: "Grade Not Found" });
      return;
    }

    result.grades[findGrade].student = student;
    result.grades[findGrade].subject = subject;
    result.grades[findGrade].type = type;
    result.grades[findGrade].value = value;

    await fs
      .writeFile(gradesFileJSON, JSON.stringify(result))
      .then(() => {
        logger.info(
          `PUT /grades - ${JSON.stringify(result.grades[findGrade])}`
        );
        res.send(result.grades[findGrade]);
      })
      .catch((err) => {
        logger.error(`PUT /grades/:id - ${err.message}`);
        res.status(400).send({ error: err.message });
      });
  } catch (err) {
    logger.error(`PUT /grades/:id - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

//DELETE - Return a grade deleted by id
router.delete("/:id", async (req, res) => {
  try {
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let result = JSON.parse(data);
    let id = Number(req.param("id"));

    const grade = result.grades.find((grade) => grade.id === id);
    if (!grade) {
      logger.error(`DELETE /grades/:id - Grade Not Found`);
      res.status(400).send({ error: "Grade Not Found" });
      return;
    }

    const grades = result.grades.filter((grade) => grade.id !== id);
    if (!grades) {
      logger.error(`DELETE /grades/:id - Grade Not Found`);
      res.status(400).send({ error: "Grade Not Found" });
      return;
    }
    result.grades = grades;

    await fs
      .writeFile(gradesFileJSON, JSON.stringify(result))
      .then(() => {
        logger.info(`DELETE /grades - ${JSON.stringify(grade)}`);
        res.send(grade);
      })
      .catch((err) => {
        logger.error(`DELETE /grades:id - ${err.message}`);
        res.status(400).send({ error: err.message });
      });
  } catch (err) {
    logger.error(`DELETE /grades/:id - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

//GET - Return all grades
router.get("/", async (req, res) => {
  try {
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let result = JSON.parse(data);

    logger.info(`GET /grades - ${JSON.stringify(result)}`);
    res.send(result);
  } catch (err) {
    logger.error(`GET /grades - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

//GET - Return a grade selected by id
router.get("/:id", async (req, res) => {
  try {
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let result = JSON.parse(data);
    let id = Number(req.param("id"));

    let grade = result.grades.find((grade) => grade.id === id);
    if (!grade) {
      logger.error(`GET /grades/:id - Grade Not Found`);
      res.status(400).send({ error: "Grade Not Found" });
      return;
    }
    logger.info(`GET /grades/:id - ${JSON.stringify(grade)}`);
    res.send(grade);
  } catch (err) {
    logger.error(`GET /grades/:id - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

//GET - Return a sum of values by student and subject params
router.get("/sum/values", async (req, res) => {
  let { student, subject } = req.body;
  try {
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let result = JSON.parse(data);

    let findStudent = result.grades.find((grade) => grade.student === student);
    if (!findStudent) {
      logger.error(`GET /grades/sum/values - Student Not Found`);
      res.status(400).send({ error: "Student Not Found" });
      return;
    }
    let findSubject = result.grades.find((grade) => grade.subject === subject);
    if (!findSubject) {
      logger.error(`GET /grades/sum/values - Subject Not Found`);
      res.status(400).send({ error: "Subject Not Found" });
      return;
    }

    const grades = result.grades.filter(
      (grade) => grade.student === student && grade.subject === subject
    );
    if (!grades || grades.length == 0) {
      logger.error(`GET /grades/sum/values - Grade Student||Subject Not Found`);
      res.status(400).send({ error: "Grade Student||Subject Not Found" });
      return;
    }

    const sumValues = grades.reduce((acc, cur) => acc + cur.value, 0);

    const resultObj = {
      student: student,
      subject: subject,
      totalValue: sumValues,
    };

    logger.info(`GET /grades/sum/values - ${JSON.stringify(resultObj)}`);
    res.send(resultObj);
  } catch (err) {
    logger.error(`GET /grades/sum/values - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

//GET - Return a avarage of values by subject and type params
router.get("/avg/values", async (req, res) => {
  let { subject, type } = req.body;
  try {
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let result = JSON.parse(data);

    let findSubject = result.grades.find((grade) => grade.subject === subject);
    if (!findSubject) {
      logger.error(`GET /grades/avg/values - Subject Not Found`);
      res.status(400).send({ error: "Subject Not Found" });
      return;
    }

    let findType = result.grades.find((grade) => grade.type === type);
    if (!findType) {
      logger.error(`GET /grades/avg/values - Type Not Found`);
      res.status(400).send({ error: "Type Not Found" });
      return;
    }

    const grades = result.grades.filter(
      (grade) => grade.subject === subject && grade.type === type
    );
    if (!grades || grades.length == 0) {
      logger.error(`GET /grades/avg/values - Grade Subject||Type Not Found`);
      res.status(400).send({ error: "Grade Subject||Type Not Found" });
      return;
    }

    const sumValues = grades.reduce((acc, cur) => acc + cur.value, 0);
    const avgValues = sumValues / grades.length;
    const resultObj = {
      subject: subject,
      type: type,
      avgValue: avgValues,
    };

    logger.info(`GET /grades/avg/values - ${JSON.stringify(resultObj)}`);
    res.send(resultObj);
  } catch (err) {
    logger.error(`GET /grades/avg/values - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

//GET - Return a three bigger number of values by subject and type params
router.get("/max/values", async (req, res) => {
  let { subject, type } = req.body;
  try {
    let data = await fs.readFile(gradesFileJSON, "utf-8");
    let result = JSON.parse(data);

    let findSubject = result.grades.find((grade) => grade.subject === subject);
    if (!findSubject) {
      logger.error(`GET /grades/max/values - Subject Not Found`);
      res.status(400).send({ error: "Subject Not Found" });
      return;
    }

    let findType = result.grades.find((grade) => grade.type === type);
    if (!findType) {
      logger.error(`GET /grades/max/values - Type Not Found`);
      res.status(400).send({ error: "Type Not Found" });
      return;
    }

    const grades = result.grades.filter(
      (grade) => grade.subject === subject && grade.type === type
    );
    if (!grades || grades.length == 0) {
      logger.error(`GET /grades/max/values - Grade Subject||Type Not Found`);
      res.status(400).send({ error: "Grade Subject||Type Not Found" });
      return;
    }

    const maxValues = grades.sort((a, b) => {
      return b.value - a.value;
    });

    const resultObj = maxValues.slice(0, 3);

    logger.info(`GET /grades/max/values - ${JSON.stringify(resultObj)}`);
    res.send(resultObj);
  } catch (err) {
    logger.error(`GET /grades/max/values - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

export default router;
