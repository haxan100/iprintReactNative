// currencyUtils.js
const formatRupiah = (number, prefix = 'Rp ') => {
  const numberString = number.toString();
  const split = numberString.split('.');
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  return split[1] !== undefined
    ? prefix + rupiah + ',' + split[1]
    : prefix + rupiah;
};

export { formatRupiah };
