from __future__ import print_function
import sys
import zerorpc
import time


class KumonApi(object):
    def echo(self, text):
        """echo any text"""
        return text

    def check_number(self, num):
        """
        Checks to see if an inputted student number is valid.
        """
        lst = [123, 222]
        if num not in lst:
            raise ValueError('Student Number not in lst')

    def mark(self, std_number, booklet_len):
        """
        Called when user presses Mark button.
        the user should select one of three options for booklet_len:
        4,3,3 => booklet_order = [1,5,8,11] 
        10 => then booklet_order = [1,11] 
        5,5 then booklet_order = [1,6,11] 
        """
        booklet_order = []

        if booklet_len == 4:
            booklet_order = [1,5,8,11]
        elif booklet_len == 5:
            booklet_order = [1,11]
        elif booklet_len == 10: 
            booklet_order = [1,6,11]

        # mark_student(std_number, booklet_order)
        time.sleep(3)
        return std_number


    # display something that says 'marking...'
    def scanning_finished(self):
        pass

    # display something that says 'printing...'
    def marking_finished(self):
        pass

    # display something that says 'done!'
    # un-gray out the Mark/Start button
    def printing_finished(self):
        pass

    def display_image(self, image_path):
        """
        Tell UI to display image of a page and request the user to enter a page number.
        @param image_path - file path to the image
        """
        pass

    def get_path_number(self, page_number):
        """
        Gets the page number that the user inputs. 
        """
        pass

    def reset(self):
        """
        Called when user presses the reset button.
        Display a 5 second loading screen to allow all the backend reset stuff to finish.
        """
        pass

        # TODO implement reset function


def parse_port():
    port = 54321
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)


if __name__ == '__main__':
    addr = 'tcp://*:' + parse_port()
    s = zerorpc.Server(KumonApi())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()
