import sys, random, time
from PyQt4 import QtGui, QtCore


class mainWidget(QtGui.QWidget):
	def __init__(self):
		super(mainWidget, self).__init__()
		self.initUI()

	def initUI(self):
		self.resize(600, 500)
		self.setWindowTitle("Passcod.es Desktop Application")

		self.domain = QtGui.QLineEdit("",self)
		self.domain.setPlaceholderText("Domain")

		self.password = QtGui.QLineEdit("",self)
		self.password.setPlaceholderText("Password")

		self.generate = QtGui.



# call the main widget
def main():
	app = QtGui.QApplication(sys.argv)

	gui = mainWidget()
	gui.show()

	app.exec_()
	print "Exiting"
	exit()

# run the main function
if __name__ == '__main__':
	#
	main()