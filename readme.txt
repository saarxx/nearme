����� ����� ������ ������ ���� ������� MONGODB
���� ������ �� ������, �� ������ �� MongoDb ������ ���� ���� ���� ���:
1) ���� �� ���� �-ZIP. 
2) ���� command prompt
3) ����� node server.js
4) ���� ��� command prompt
��� ������ ������� ������ ������ http ��� ���� ������. ������ ��� ����� ����� ���������� REST
GET: >curl http://localhost:3000/students

GET for speicifc id :>curl http://localhost:3000/students/12
POST: >curl --data "name=uzy&year=1990&country=israel" http://localhost:3000/students
UPDATE:>curl -X PUT -d "year=2010&name=roi&sid=12" http://localhost:3000/students/12
DELETE:>curl -X DELETE http://localhost:3000/students/12

��� �� ��� ����� �� ������ � cloudfoundry  ���� ������ �� ������ ���� ������ ����� service 
���� mongodb
���� ��� ���� ����� ��� ��� �� �� ������� ����� (�� ��������� ��� 
���� ���:mongoidc.cloudfoundry.com 
���� �� �� ��� �� �������� ���� ����

GET: >curl mongoidc.cloudfoundry.com/students
GET for speicifc id :>curl mongoidc.cloudfoundry.com/students/12
POST: >curl --data "name=uzy&year=1990&country=israel" mongoidc.cloudfoundry.com/students
UPDATE:>curl -X PUT -d "year=2010&name=roi&sid=12" mongoidc.cloudfoundry.com/students/12
DELETE:>curl -X DELETE mongoidc.cloudfoundry.com/students/12
