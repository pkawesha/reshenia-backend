export function safeJson(res,payload,status=200){try{return res.status(status).json(payload);}catch(e){return res.status(500).type('text/plain').send('Server error serializing JSON');}}
