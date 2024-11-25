
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const retryOperation = async (operation, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * Math.pow(2, i)); // exponential backoff
    }
  }
};

export const sanitizeData = (data) => {
  if (typeof data === 'string') {
    return data.trim().replace(/\s+/g, ' ');
  }
  return data;
};