/********************************** SIGNATURE *********************************\
|                                      ,,                                      |
|                     db             `7MM                                      |
|                    ;MM:              MM                                      |
|                   ,V^MM.    ,pP"Ybd  MMpMMMb.  .gP"Ya `7Mb,od8               |
|                  ,M  `MM    8I   `"  MM    MM ,M'   Yb  MM' "'               |
|                  AbmmmqMA   `YMMMa.  MM    MM 8M""""""  MM                   |
|                 A'     VML  L.   I8  MM    MM YM.    ,  MM                   |
|               .AMA.   .AMMA.M9mmmP'.JMML  JMML.`Mbmmd'.JMML.                 |
|                                                                              |
|                                                                              |
|                                  ,,    ,,                                    |
|                      .g8"""bgd `7MM    db        `7MM                        |
|                    .dP'     `M   MM                MM                        |
|                    dM'       `   MM  `7MM  ,p6"bo  MM  ,MP'                  |
|                    MM            MM    MM 6M'  OO  MM ;Y                     |
|                    MM.    `7MMF' MM    MM 8M       MM;Mm                     |
|                    `Mb.     MM   MM    MM YM.    , MM `Mb.                   |
|                      `"bmmmdPY .JMML..JMML.YMbmd'.JMML. YA.                  |
|                                                                              |
\******************************************************************************/
/*********************************** LICENSE **********************************\
| Copyright (c) 2013, Asher Glick                                              |
| All rights reserved.                                                         |
|                                                                              |
| Redistribution and use in source and binary forms, with or without           |
| modification, are permitted provided that the following conditions are met:  |
|                                                                              |
| * Redistributions of source code must retain the above copyright notice,     |
|   this list of conditions and the following disclaimer.                      |
| * Redistributions in binary form must reproduce the above copyright notice,  |
|   this list of conditions and the following disclaimer in the documentation  |
|   and/or other materials provided with the distribution.                     |
|                                                                              |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"  |
| AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE    |
| IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE   |
| ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE    |
| LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR          |
| CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF         |
| SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS     |
| INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN      |
| CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)      |
| ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE   |
| POSSIBILITY OF SUCH DAMAGE.                                                  |
\******************************************************************************/
package app.seraph.passcodes;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Locale;

import android.annotation.TargetApi;
import android.app.Activity;
//import android.text.ClipboardManager;
//import android.content.ClipData;
//import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		Button tasklistButton = (Button) findViewById(R.id.generateButton);
		tasklistButton.setOnClickListener(new OnClickListener() { public void onClick(View v) { generatePasscode();} } );
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}
	
	/****************************** GENERATE PASSCODE *****************************\
	| Generate passcode is called when the user clicks the generate button. It     |
	| grabs the values from the password box and the domain box then calls the     |
	| functions to create a base64 hash of the password, trims the hash to 16      |
	| characters and copies it to the clipboard                                    |
	\******************************************************************************/
	public void generatePasscode() {
		
		EditText domainBox = (EditText) findViewById(R.id.domainBox);
		EditText passwordBox = (EditText) findViewById(R.id.passwordBox);
		
		String domain = domainBox.getText().toString();
		String password = passwordBox.getText().toString();
		
		domain = domain.toLowerCase(Locale.ENGLISH);
		
		String hash = createHash(domain,password); 
		
		//toast(hash);
		String shortHash = hexToBase64(hash).substring(0,16);
		
		copyToClipboard(shortHash);
		toast("Copied to clipboard");
	}
	
	/********************************* CREATE HASH ********************************\
	| The create hash function takes in the domain and the master password and     |
	| returns a string of hex character containing the sha256 hash of the          |
	| concatination of the domain and the password                                 |
	\******************************************************************************/
	public String createHash(String domain, String password) {
		String concat = domain+password;
		
		MessageDigest digest = null; // initilize the possible digest
		
		try {digest = MessageDigest.getInstance("SHA-256");}
		catch (NoSuchAlgorithmException e1) {
			e1.printStackTrace();
		}
		digest.reset();
		byte[] hash = digest.digest(concat.getBytes());
		return String.format("%0" + (hash.length*2) + "X", new BigInteger(1, hash));
	}
	
	  //////////////////////////////////////////////////////////////////////////////
	 //////////////////////// COPY TO CLIPBOARD FUNCTIONS ///////////////////////// 
	//////////////////////////////////////////////////////////////////////////////  
	
	/****************************** COPY TO CLIPBOARD *****************************\
	| This function is a wrapper for the copy to clipboard old and new functions.  |
	| It acts as abstraction layer for the actual copy to clipboard functions'     |
	\******************************************************************************/
	public void copyToClipboard(String clip) {
		// If this device does not have the new clipboard function then use the old one
		if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.HONEYCOMB 	) {
			copyToClipboardOld(clip);
		}
		// otherwise use the new one
		else {
			copyToClipboardNew (clip);
		}
	}
	/**************************** COPY TO CLIPBOARD NEW ***************************\
	| This function uses the new functions for copying to the clipboard for        |
	| android devices that have a high enough API level to handle the new method   |
	\******************************************************************************/
	@TargetApi(Build.VERSION_CODES.HONEYCOMB)
	public void copyToClipboardNew(String clip) {
		android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
		android.content.ClipData clipping = android.content.ClipData.newPlainText("simple text",clip);
		clipboard.setPrimaryClip(clipping);
	}
	
	/**************************** COPY TO CLIPBOARD OLD ***************************\
	| This function uses the deprecated method for copying to the clipboard for    |
	| devices that are unable to use the new API (all pre-honycomb devices) so     |
	| that the clipboard will still work                                           |
	\******************************************************************************/
	@TargetApi(Build.VERSION_CODES.ECLAIR)
	@SuppressWarnings("deprecation")
	public void copyToClipboardOld(String clip) {
		android.text.ClipboardManager clipboard = (android.text.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
		clipboard.setText(clip);
	}
	
	  //////////////////////////////////////////////////////////////////////////////
	 //////////////////////////// CONVERSION FUNCTIONS //////////////////////////// 
	//////////////////////////////////////////////////////////////////////////////  

	/**************************** HEX TO DECIMAL ARRAY ****************************\
	| The hex to decimal array function takes in a string of hex characters and    |
	| returns an array of integers containing the decimal equivalent of each hex   |
	| character in the string. The string and the decimal array are both read      |
	| left to right (0-n)                                                          |
	\******************************************************************************/
	int[] hexToDecimalArray(String hexString) {
		String hex = "0123456789ABCDEF";
		int[] decimalArray = new int[hexString.length()];
		for (int i = 0; i < hexString.length(); i++) {
			decimalArray[i] = hex.indexOf( hexString.substring(i, i+1) );
		}
		return decimalArray;
	}
	
	/****************************** DECIMAL TO BASE64 *****************************\
	| This function takes a single decimal value and converts it to a single base  |
	| 64 character. It does no input sanitization and if the decimal value is out  |
	| of bounds then it will cause a problem without raising exceptions            |
	\******************************************************************************/
	String decimalToBase64(int decimalValue) {
		String base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#";
		return base64.substring(decimalValue,decimalValue+1);
	}
	
	/******************************** HEX TO BASE64 *******************************\
	| This function takes in a string of hex characters and converts it to a       |
	| string of base64 characters. It is able to take in any number of hex         |
	| characters even if they are not an even number of characters (or dont        |
	| create a full byte)                                                          |
	\******************************************************************************/
	String hexToBase64(String hexString) {
		int[] decimalArray = hexToDecimalArray(hexString);
		String base64string = "";
		
		// If this is the only element in this group of three
		for (int i = 0; i < decimalArray.length; i+=3){
			if (decimalArray.length == i+1) {
				base64string += decimalToBase64(decimalArray[i] * 4);
				base64string += '='; // append = to the end of the string to represent the missing bits
			}
			// If there are only two elements in this group of three
			else if (decimalArray.length == i+2) {
				int leftSplit = decimalArray[i+1]/4;
				int rightSplit = decimalArray[i+1]%4;
				base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
				base64string += decimalToBase64( rightSplit * 16);
				base64string += "=="; // append == to the end of the string to represent the missing bits
			}
			// If there are all three elements in this group of three
			else {
				int leftSplit = decimalArray[i+1]/4;
				int rightSplit = decimalArray[i+1]%4;
				base64string += decimalToBase64(decimalArray[i] * 4 + leftSplit);
				base64string += decimalToBase64( rightSplit * 16 + decimalArray[i+2] );
			}
		}
		return base64string;
	}
	
	/************************************ TOAST ***********************************\
	| A wrapper for the android toast function. Used to display a message on the   |
	| screen                                                                       |
	\******************************************************************************/
	public void toast(String message) {
		int duration = Toast.LENGTH_SHORT;		
		Toast toast = Toast.makeText(this, message, duration);
		toast.show();
	}
}
