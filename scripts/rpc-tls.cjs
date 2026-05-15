/**
 * Some Windows / campus networks break TLS verification for public RPC endpoints.
 * Loaded only for Sepolia deploy/verify scripts (see package.json).
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
