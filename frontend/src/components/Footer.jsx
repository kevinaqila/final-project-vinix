const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-green-600 mb-4">FinancePro</h3>
            <p className="text-sm text-gray-600">
              Platform freelance keuangan terpercaya untuk menghubungkan klien dengan profesional keuangan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Untuk Klien</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/services" className="hover:text-green-600 transition-colors">
                  Cari Jasa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Kategori
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Untuk Freelancer</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Mulai Menjual
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Tips Sukses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Komunitas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Kebijakan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Kontak
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="text-center text-sm text-gray-600">
          <p>© 2025 FinancePro. All rights reserved. Platform Freelance Keuangan Terpercaya.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
