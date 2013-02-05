import sys, random, time
from PyQt4 import QtGui, QtCore

################################ MAIN QT WIDGET ################################
# The main qt widget handles all of the ui inside of the main window. This     #
# mainly includes the two list views displaying all of the students as well    #
# as just the students selected. Allong with the ability to search those lists #
################################################################################
class mainWidget(QtGui.QWidget):
	def __init__(self):
		super(mainWidget, self).__init__()
		self.initUI()

	## this function intilizes the UI for the main widget which currently involves seting up two lists that get written to
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