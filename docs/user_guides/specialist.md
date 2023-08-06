# User Guide - Field HCP

## Table of Contents

- [Basic Navigation & Home Screen](#basic-navigation--home-screen)
- [Consultation](#consultation)
  - [Viewing Exams](#viewing-exams)
  - [New Consultation / Edit Consultation](#new-consultation--edit-consultation)
  - [Viewing Consultations](#viewing-consultation)
- [Exams Awaiting Consultations](#exams-awaiting-consultations)
- [Notifications](#notifications)

## Basic Navigation & Home Screen

![specialist home page](./images/spec_01.png)

When you first login you will be redirected to your home page under eyeConnect Portal.

To the left side you'll see a list of exams uploaded by your field colleagues that are awaiting specialist consultation. You can use the toggler on the top right side of this table to include exams that don't have a retina image associated with them. Clicking on any row of this table will take you to that exam's details page. To start a consultation for an exam you can use the blue notes icon (![notes icon](./images/notes_btn.png)) on the rows as a shortcut.

![awaiting consultations inc. without images](./images/spec_02.png)

To the right side you will see another table titled my recent consultations which shows your most recent completed (or created but incomplete) consultations. Clicking on any row will take you to that consultation's details page where you can edit your notes, change your diagnosis or delete the consultation. You can also use the trash icon (![trash icon](./images/trash_btn.png)) on the rows as a shortcut to delete the consultation without going to its details page.
<blockquote>
Use &uarr; and &darr; next to table headers to sort the table by that value.
</blockquote>

The links under the tables (`Go to awaiting consultations` and `Go to your consultations`) are shortcuts for the navigation items under `Portal` in the navbar, which will take you to a list of exams awaiting consultations and a list of all completed consultations respectively.

## Consultation

### Viewing Exams

![view exam details](./images/spec_03.png)

Exam details page will show patient demographics information and examination notes of the primary examiner, alongside any uploaded fundus imagery.

You can click the magnifying icon (![magnify icon](./images/magnify_btn.png)) to enlarge any image to original size for closer inspection. The light blue icon (![results icon](./images/image_btn.png)) below that will display a pop-up showing the results of the automatic image classification.

As a specialist, you won't be able to edit the primary examiner's notes. Click on the new consultation icon (![new cons icon](./images/notes_btn.png)) to start a new consultation.

### New Consultation / Edit Consultation

![consultation details](./images/spec_04.png)

When you create a new consultation (after a brief loading screen) you will be redirected to `Consultation Details` page. Pretty similar to the Exam Details page, this view provides an additional place for your consultation notes.
<blockquote>
Notice that even though you have just started a new consultation, you are actually updating an empty consultation created under your name for this particular examination. If you had not intended to create a consultation at this point, please make sure to use the trash icon (<img src="./images/trash_btn.png" alt="trash icon">) to delete the consultation record, even if it is empty.

Also note that your notes will <b>NOT</b> automatically save. Once you make changes, be sure to save them using the save button (<img src="./images/save_btn.png" alt="save icon">) next to the delete icon, on the top right of the consultation card.
</blockquote>

If you use the magnify icon (![magnify icon](./images/magnify_btn.png)) for a consultation you own, you will view the enlarged imagery, with your notes area at the bottom of it. Your notes from the consultation screen will carry over to this area, and vice versa. You can use the `x` on the top right corner or `Esc` button on your keyboard to close this pop-up.

![enlarged image for consultation](./images/spec_05.jpeg)

Once you are done taking down your notes, be sure to select a diagnosis for retinopathy from the dropdown under patient information.

![diagnosis dropdown](./images/spec_06.png)

<blockquote>
In order to be able to save <img src="./images/save_btn.png" alt="save icon"> your consultation notes, you must provide <b>both notes and a diagnosis.</b>
</blockquote>

Although discouraged, a primary examiner might delete their examination for any reason, even if it has a consultation. In such a case, as the specialist you will still have access to your consultation notes, along with any fundus imagery associated with it, but you will no longer be able to view the primary examiner's notes.
<blockquote>
If an examination is deleted and it has no consultation, the images uploaded for that exam will automatically be deleted. However if it has an associated consultation, the images will only be deleted if the consultation is deleted too by the consultant.

The only exception is if a `Medical Director`, for any reason, deletes a patient record altogether. In that case all medical data (exams, consultations, funduscopies) for that particular patient will be deleted from the system, and you won't be able to access them any longer.
</blockquote>

![deleted exam](./images/spec_08.png)

### Viewing Consultation

When viewing a consultation you have previously created, you will be able to update your notes and diagnosis. This will notify the examiner about the changes.

![other's consultation](./images/spec_07.png)

When viewing consultation notes created by another consultant, you won't be able to edit notes, update diagnosis or delete the consultation.

To view all completed consultations, either completed by you or other consultants, you can use the navigation bar `Portal>Completed Consultations` or click `view all consultations` link on your home page. Either option will take you to the Completed Consultations page (even-though the title says **completed** any consultations created but that were not updated with notes and diagnosis will also be listed.) Use the toggler to the top right of the table to list only your own consultations or all consultations. Clicking on any row of the table will take you to that consultation's details view. You can use the trash icon (![trash icon](./images/trash_btn.png)) as a shortcut to delete consultations belonging to you.

![all consultations](./images/spec_09.png)

## Exams Awaiting Consultations

You can click on the `view all exams awaiting consultations` link on your home page or use the navigation `Portal>Awaiting Consultations` to view a full list of all examinations without consultations. Just like in your home page view, you can use the toggler on the top right of the table to include or exclude exams that don't have fundus images. Clicking on any row in this table will take you to the exam details page for that record. You can use the begin consultation icon (![begin cons icon](./images/notes_btn.png)) to begin a new consultation for that particular exam.

![all awaiting consultations](./images/spec_10.png)

## Notifications

To the right side of the navbar, you will see a bell-icon. It will have a red badge with a number if you have any new notifications (you will receive notifications if an exam you have completed a consultation for is updated, images were added, or if it was deleted). Clicking the bell icon will expand your notifications. Clicking on an exapanded notification will take you to the relevant resource page.

![notifications](./images/spec_11.png)