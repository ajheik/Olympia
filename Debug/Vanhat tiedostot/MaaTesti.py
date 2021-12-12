import unittest

import Maa as m

class TestMaa(unittest.TestCase):
    def setUp(self):
        self.maa = m.Maa("Suomi", [50,75,100])

    def test_default(self):
        self.assertEqual(self.maa.nimi, "Suomi")
        self.assertEqual(self.maa.mitalit, [50,75,100])


if __name__ == '__main__':
    unittest.main()
