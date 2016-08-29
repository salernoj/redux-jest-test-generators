export const testService = isSuccessful => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isSuccessful) {
                resolve();
            } else {
                reject();
            }
        }, 500);
    });
}