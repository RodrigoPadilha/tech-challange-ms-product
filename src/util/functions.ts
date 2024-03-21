export const emptyToUndefined = (str: any) => {
    if (str == "" || str == null || str == undefined || str.length == 0) return undefined
    return str
  }