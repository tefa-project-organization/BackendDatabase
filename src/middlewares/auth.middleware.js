import httpStatus from 'http-status-codes';
import { ApiError } from '../exceptions/errors.exception.js';
import { verifyToken } from '../helpers/jwt.helper.js';
import { Unauthenticated } from '../exceptions/catch.execption.js';
import prisma from '../config/prisma.db.js';
import { decrypt } from "../helpers/encryption.helper.js";

export default function auth(roles) {
  return async (req, res, next) => {
    try {
      const encryptedToken = req.cookies?.cookies_access_token;
      console.log("Encrypted Cookie:", encryptedToken);

      if (!encryptedToken) {
        return next(new ApiError(401, 'NO_AUTHORIZATION', 'Please Login First'));
      }

      // 1. decrypt
      let token;
      try {
        token = decrypt(encryptedToken);
        console.log("Decrypted Token:", token);
      } catch (err) {
        console.error("Decrypt error:", err);
        return next(new Unauthenticated("Invalid encrypted token"));
      }

      // 2. verify jwt
      let decoded;
      try {
        decoded = verifyToken(token);
        console.log("Decoded JWT:", decoded);
      } catch (err) {
        console.error("JWT Verify Error:", err);
        return next(new Unauthenticated("Invalid or expired token"));
      }

      const employeesId = decoded?.userId || decoded?.employeesId;
      if (!employeesId) {
        return next(new Unauthenticated("Teu login"));
      }

      // 3. FETCH EMPLOYEE DARI DB
      const employees = await prisma.employees.findUnique({
        where: { id: employeesId }
      });

      if (!employees) {
        return next(new Unauthenticated("Employee not found"));
      }

      // 4. BAN CHECK
      if (employees.status === false) {
        if (employees.duration && employees.duration > new Date()) {
          return next(
            new Unauthenticated("Your account is banned until " + employees.duration)
          );
        }
      }

      // 5. AUTO UNBAN
      if (
        employees.status === false &&
        employees.duration &&
        employees.duration <= new Date()
      ) {
        await prisma.employees.update({
          where: { id: employees.id },
          data: { status: true, duration: null },
        });

        employees.status = true;
      }

      // save ke req
      req.employees = employees;
      req.employeesId = employees.id;

      next();
    } catch (e) {
      if (e.message === 'jwt expired') {
        return next(
          new ApiError(
            httpStatus.StatusCodes.UNAUTHORIZED,
            'NO_ACCESS',
            'Expired Login Session'
          )
        );
      }
      console.error(e);
      return next(e);
    }
  };
}
