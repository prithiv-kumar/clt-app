try {
    user = FirebaseAuth.instance.currentUser;
    log(user!.uid);
    var dio = di.Dio();
    di.FormData formData;
    formData = di.FormData.fromMap({
      'validRtaCard':  await di.MultipartFile.fromFile(selectedRTACard!.path, filename: selectedRTACard!.path.split('/').last),
      'driverProfilePhoto': await di.MultipartFile.fromFile(selectedProfilePhoto!.path, filename: selectedProfilePhoto!.path.split('/').last),
      'validEmiratesId': await di.MultipartFile.fromFile(selectedEmiratesID!.path, filename: selectedEmiratesID!.path.split('/').last),
      'carPhoto1': await di.MultipartFile.fromFile(selectedCarPhoto![0].path, filename: selectedCarPhoto![0].path.split('/').last),
      'carPhoto2': await di.MultipartFile.fromFile(selectedCarPhoto![1].path, filename: selectedCarPhoto![1].path.split('/').last),
      'carPhoto3': await di.MultipartFile.fromFile(selectedCarPhoto![2].path, filename: selectedCarPhoto![2].path.split('/').last),
      'carPhoto4': await di.MultipartFile.fromFile(selectedCarPhoto![3].path, filename: selectedCarPhoto![3].path.split('/').last),
      'validEmiratesPass': await di.MultipartFile.fromFile(selectedEmiratesPassport!.path, filename: selectedEmiratesPassport!.path.split('/').last),
      'RtaRegVehicle': await di.MultipartFile.fromFile(selectedRTARegisteredVehicle!.path, filename: selectedRTARegisteredVehicle!.path.split('/').last),
      'uid':user!.uid,
    });


    di.Response response =
        await dio.post('${ServerAddresses.baseUrl}upload',
        data: formData,
        options: di.Options(
            headers: {
              'content-type': "multipart/form-data",
            }
        )
        );
    log('break2');
    log(response.toString());

    documentUploadResponse = SuccessFailureModel.fromMap(response.data);
    notifyListeners();
    log('break3');
    if (documentUploadResponse!.success == true) {
      uploadDocumentLoading = false;
      Get.offAllNamed('/successScreen');
      notifyListeners();
    } else {
      uploadDocumentLoading = false;
      notifyListeners();
      Themes.showSnackBar(
          context: context, msg: documentUploadResponse!.message);

    }
  }