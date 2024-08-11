import pino from "pino";

export default pino({
  enabled: true,
  level: "info",
  // This is a custom pino serializer
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: res.headers,
    }),
  },
});
