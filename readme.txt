הדרכה להרצת הדוגמא לשימוש במסד הנתונים MONGODB
לפני שמרצים את הדוגמא, יש להתקין את MongoDb ולהריץ אותו ברקע לאחר מכן:
1) פתחו את קובץ ה-ZIP. 
2) פתחו command prompt
3) הריצו node server.js
4) פתחו עוד command prompt
כעת השורות הפקודות יוצרות קריאות http מול השרת שהרצתם. פקודות אלו מראות שימוש בארכיטקורת REST
GET: >curl http://localhost:3000/students

GET for speicifc id :>curl http://localhost:3000/students/12
POST: >curl --data "name=uzy&year=1990&country=israel" http://localhost:3000/students
UPDATE:>curl -X PUT -d "year=2010&name=roi&sid=12" http://localhost:3000/students/12
DELETE:>curl -X DELETE http://localhost:3000/students/12

כעת על מנת להריץ את הדוגמא ב cloudfoundry  עלכם להעלות את הקבצים לענן ולבוחר עבורו service 
מסוג mongodb
לאחר מכן ניתן לבדוק שזה אכן רץ עם הפקודות הבאות (שם האפליקציה שלי 
בענן הוא:mongoidc.cloudfoundry.com 
תשנו את זה לפי שם האפלקציה שלכם בענן

GET: >curl mongoidc.cloudfoundry.com/students
GET for speicifc id :>curl mongoidc.cloudfoundry.com/students/12
POST: >curl --data "name=uzy&year=1990&country=israel" mongoidc.cloudfoundry.com/students
UPDATE:>curl -X PUT -d "year=2010&name=roi&sid=12" mongoidc.cloudfoundry.com/students/12
DELETE:>curl -X DELETE mongoidc.cloudfoundry.com/students/12
