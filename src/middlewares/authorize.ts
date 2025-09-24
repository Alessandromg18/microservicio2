import { Request, Response, NextFunction } from "express";

type Options = {
  /**
   * Si true, además de chequear roles, permite la operación
   * solo si el requester es ADMIN o el mismo userId objetivo.
   */
  allowSameUser?: boolean;
};

function extractUserFromReq(req: any): { id?: number; role?: string } {
  // 1) Revisar headers
  const headerId =
    req.headers["x-user-id"] ||
    req.headers["x-userid"] ||
    req.headers["user-id"];
  const headerRole =
    req.headers["x-user-role"] ||
    req.headers["x-role"] ||
    req.headers["role"];

  if (headerId || headerRole) {
    return { id: Number(headerId), role: headerRole };
  }

  // 2) Revisar body
  if (req.body) {
    if (req.body.userId || req.body.role) {
      return { id: Number(req.body.userId), role: req.body.role };
    }
  }

  // 3) Revisar params / query
  if (req.params?.userId || req.params?.id) {
    return { id: Number(req.params.userId ?? req.params.id) };
  }
  if (req.query?.userId || req.query?.id) {
    return { id: Number(req.query.userId ?? req.query.id) };
  }

  return {};
}

/**
 * Middleware de autorización flexible.
 * allowedRoles: lista de roles permitidos (ej: ['USER'], ['ADMIN'], ['USER','ADMIN'])
 * options.allowSameUser: si true -> permite operación si requester es ADMIN o requester.id === targetUserId
 */
export const authorize =
  (allowedRoles: string[], options: Options = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const anyReq = req as any;
      const extracted = extractUserFromReq(anyReq);

      if (!extracted.id || !extracted.role) {
        return res
          .status(401)
          .json({ message: "Usuario/rol no proporcionado" });
      }

      const role = String(extracted.role).toUpperCase();
      const allowedUpper = allowedRoles.map((r) => String(r).toUpperCase());

      if (!allowedUpper.includes(role)) {
        return res
          .status(403)
          .json({ message: "Acceso denegado: rol no autorizado" });
      }

      // Guardamos en req.user para usar en controladores
      anyReq.user = { id: extracted.id, role };

      // Validación de propietario si se pide
      if (options.allowSameUser) {
        const targetId =
          anyReq.params?.userId ??
          anyReq.params?.id ??
          anyReq.body?.userId ??
          anyReq.query?.userId;

        if (!targetId) {
          return res
            .status(400)
            .json({ message: "Falta userId objetivo para validar propietario" });
        }

        if (role !== "ADMIN" && extracted.id !== Number(targetId)) {
          return res
            .status(403)
            .json({ message: "Acceso denegado: solo el propietario o admin" });
        }
      }

      return next();
    } catch (err) {
      console.error("Authorization middleware error:", err);
      return res.status(500).json({ message: "Error en autorización" });
    }
  };

export default authorize;
