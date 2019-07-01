from __future__ import print_function
from calc import calc as real_calc
import sys
import zerorpc

class CalcApi(object):
    def calc(self, text):
        """based on the input text, return the int result"""
        try:
            return "hey"
        except Exception as e:
            return 0.0    

    def echo(self, text):
        """echo any text"""
        return text
    def checkNumber(self, num):
        lst = [1,123,1234]
        if num not in lst:
            raise ValueError('Student Number not in lst') 
        

def parse_port():
    port = 54321
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)

def main():
    addr = 'tcp://*:' + parse_port()
    s = zerorpc.Server(CalcApi())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()
