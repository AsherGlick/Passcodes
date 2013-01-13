package app.seraph.passcodes;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

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
	
	// main function to call when the generate button gets pressed
	public void generatePasscode() {
		
		EditText domainBox = (EditText) findViewById(R.id.domainBox);
		EditText passwordBox = (EditText) findViewById(R.id.passwordBox);
		
		String domain = domainBox.getText().toString();
		String password = passwordBox.getText().toString();
		copyToClipboard("HELLO EVERYONE!");
		
		int duration = Toast.LENGTH_LONG;
		byte[] data = getHash(domain,password);
		String hash = String.format("%0" + (data.length*2) + "X", new BigInteger(1, data));
		Toast toast = Toast.makeText(this, hash, duration);
		toast.show();
		
		String numbers = "";
		for (byte b : data) {
			numbers += (int)b + ",";
		}
		
		Toast toast2 = Toast.makeText(this, numbers, duration);
		toast2.show();
	}
	
	/****************************** COPY TO CLIPBOARD *****************************\
	| This function is a wrapper for the copy to clipboard old and new functions.  |
	| It acts as abstraction layer for the actual copy to clipboard functions'     |
	\******************************************************************************/
	public void copyToClipboard(String clip) {
		// If this divice does not have the new clipboard function then use the old one
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
	
	public byte[] getHash(String domain, String password) {
		String concat = domain+password;
		
		MessageDigest digest = null; // initilize the possible digest
		
		try {digest = MessageDigest.getInstance("SHA-256");}
		catch (NoSuchAlgorithmException e1) {
			e1.printStackTrace();
		}
		digest.reset();
		return digest.digest(concat.getBytes());
	}
}
